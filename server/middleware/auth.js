//middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Token = require("../models/token");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error("Authentication failed");
    }

    const isTokenBlacklisted = await Token.findOne({ token });

    if (isTokenBlacklisted) {
      throw new Error("Token is blacklisted");
    }

    req.user = user;
    console.log(`user from authmiddleware ${user}`);
    console.log("successfully logged in");
    next();
  } catch (error) {
    res.status(401).json({ message: error.message || "Authentication failed" });
  }
};
