// models/submission.js
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  result: {
    type: [
      {
        question: String,
        options: [String],
        userOption: String,
        isCorrect: Boolean,
        correctOption: String,
      },
    ],
    required: true,
  },
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
