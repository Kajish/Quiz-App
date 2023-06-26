// controllers/auth.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Token = require("../models/token");
const Joi = require("joi");
const Quiz = require("../models/quiz");
//
//
//
// Signup controller.....................
exports.signup = async (req, res) => {
  try {
    if (!req.body.username || !req.body.email || !req.body.password) {
      // Prompt the user to enter the required fields
      return res.status(400).json({
        message: "Please enter your username, email, and password",
      });
    }
    const { username, email, password } = req.body;

    // Validate request data using Joi
    const schema = Joi.object({
      username: Joi.string().alphanum().required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
          )
        )
        .required()
        .messages({
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character and should atleast be atleat8characters long",
        }),
    });

    const validation = schema.validate({ username, email, password });
    if (validation.error) {
      return res
        .status(400)
        .json({ message: validation.error.details[0].message });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Return response
    res.status(201).json({ message: "User created succesfully" });
    console.log("Created user succesfully");
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};
//
//
//
// Login controller...........................
exports.login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      // Prompt the user to enter the required fields
      return res.status(400).json({
        message: "Please enter your email and password",
      });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Fetch quizzes belonging to the user
    const quizzes = await Quiz.findOne({ createdBy: user._id }).select(
      "title _id link"
    );

    // Fetch quiz submissions for each quiz
    // const quizzesWithSubmissions = await Promise.all(
    //   quizzes.map(async (quiz) => {
    //     const submissions = await Submission.find({ quizId: quiz._id }).select(
    //       "name score"
    //     );
    //     return {
    //       ...quiz.toObject(),
    //       submissions,
    //     };
    //   })
    // );

    // Return response with quizzes and submissions
    res.json({
      username: user.username,
      userId: user._id,
      token,
      // quizzes: quizzesWithSubmissions,
      message: "Successfully logged in for one hour",
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

//
//
//signout controller
exports.signout = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add the token to the blacklist
    await Token.create({ token });

    res.json({ message: "Signout successful" });
  } catch (error) {
    console.error("Error signing out:", error);
    res.status(500).json({ message: "An error occurred while signing out" });
  }
};
//
//
//
//
// Delete account controller
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    // Delete the user's account record
    await User.findByIdAndDelete(userId);

    // Delete any associated data, such as quizzes created by the user
    await Quiz.deleteMany({ createdBy: userId });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};
