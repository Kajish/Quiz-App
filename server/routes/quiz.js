//ProProfs\routes\quiz.js
const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quiz");
const authMiddleware = require("../middleware/auth");

// Create quiz route
router.post("/new", authMiddleware, quizController.createQuiz);

//Delete quiz route
router.delete(
  "/delete-quiz/:quizId",
  authMiddleware,
  quizController.deleteQuiz
);
//modify quiz route
router.put(
  "/:quizId/question/:questionId",
  authMiddleware,
  quizController.updateQuestion
);

module.exports = router;
