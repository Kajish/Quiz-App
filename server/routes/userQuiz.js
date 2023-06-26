//ProProfs\routes\userQuiz.js
const express = require("express");
const router = express.Router();
const quizController = require("../controllers/userQuiz");

// GET request to fetch a quiz by its link
router.get("/:link", quizController.getQuizByLink);

router.post("/submit-quiz/:link", quizController.submitQuiz);
module.exports = router;
