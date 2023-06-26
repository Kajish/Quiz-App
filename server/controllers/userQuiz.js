// controllers/userQuiz.js
const Submission = require("../models/submission");
const Quiz = require("../models/quiz");

exports.getQuizByLink = async (req, res) => {
  try {
    const { link } = req.params;
    // Find the quiz by link
    const quiz = await Quiz.findOne({ link }); //.select("title _id");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Return the quiz
    res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};
// POST /submit-quiz/:quizId
// exports.submitQuiz = async (req, res) => {
//   try {
//     const { link } = req.params;
//     const quiz = await Quiz.findOne({ link });

//     if (!quiz) {
//       return res.status(404).json({ message: "Quiz not found" });
//     }
//     const { name, email, answers } = req.body;

//     // Compare the user's answers with the correct options
//     let score = 0;
//     const result = [];

//     for (let i = 0; i < quiz.questions.length; i++) {
//       const question = quiz.questions[i];
//       const correctOption = question.correctOption;
//       const userOption = answers[i];

//       const isCorrect = correctOption == userOption;

//       result.push({
//         question: question.question,
//         options: question.options,
//         userOption,
//         isCorrect,
//       });
//       console.log(isCorrect);
//       console.log("1");
//       if (isCorrect) {
//         score++;
//         console.log("2");
//         console.log(`score ${score}`);
//       }
//     }

//     // Save the submission to the database
//     const submission = new Submission({
//       quizId: quiz._id,
//       name,
//       email,
//       score,
//       result,
//     });
//     await submission.save();

//     // Return the score and result
//     res.json({ score, result });
//   } catch (error) {
//     console.error("Error processing quiz:", error);
//     res.status(500).json({ message: "An error occurred" });
//   }
// };

exports.submitQuiz = async (req, res) => {
  try {
    const { link } = req.params;
    const quiz = await Quiz.findOne({ link });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const { name, email, score, result } = req.body;

    // Save the submission to the database
    const submission = new Submission({
      quizId: quiz._id,
      name,
      email,
      score,
      result,
    });
    await submission.save();

    // Return the score and result
    res.json({ score, result });
  } catch (error) {
    console.error("Error processing quiz:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};
