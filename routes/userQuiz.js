//ProProfs\routes\userQuiz.js
const express = require("express");
const router = express.Router();
const quizController = require("../controllers/userQuiz");

// GET request to fetch a quiz by its link
router.get("/:link", quizController.getQuizByLink);
//TODO the submit button for user which gwts the quiz first compares them to get a score and then to send then to user and admin
router.post("/submit-quiz/:link", quizController.submitQuiz);
module.exports = router;

//20 - 05 - 66;
