// controller/quiz.js
const Quiz = require("../models/quiz");
const shortid = require("shortid");

//create quiz controller
exports.createQuiz = async (req, res) => {
  try {
    const createdBy = req.user._id;
    const { title, questions } = req.body;

    // Generate a unique link for the quiz
    const link = shortid.generate();

    // Create a new quiz
    const quiz = await Quiz.create({
      createdBy,
      title,
      link,
      questions,
    });

    res.status(201).json({ quiz, message: "Quiz created successfully" });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

//delete quiz controller
exports.deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Find the quiz by ID and delete it
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Optionally, you can delete any associated data or perform additional cleanup here

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

//updatequiz controller
exports.updateQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const { question, options, correctOption } = req.body;

    // Update the question within the quiz
    const updatedQuiz = await Quiz.updateOne(
      { _id: quizId, "questions._id": questionId },
      {
        $set: {
          "questions.$.question": question,
          "questions.$.options": options,
          "questions.$.correctOption": correctOption,
        },
      }
    );

    if (updatedQuiz.nModified === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(updatedQuiz);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};
