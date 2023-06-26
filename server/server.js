//server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");
const userRoutes = require("./routes/userQuiz");

// Load environment variables
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Create the Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
// Route for signup,login,signout,delete-account
app.use("/api/auth", authRoutes);
// Route for creating quiz
app.use("/api/quiz", quizRoutes);
//Route for quiz Taker
app.use("/user/quiz", userRoutes);

// Start the server
//|| 5000;
//const PORT = process.env.PORT;
const port = process.env.port || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// const API_BASE_URL = process.env.API_BASE_URL;
// console.log(API_BASE_URL);
