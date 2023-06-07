//ProProfs\routes\auth.js
const express = require("express");
const router = express();
const authController = require("../controllers/auth");
const authMiddleware = require("../middleware/auth");

// Signup route
router.post("/signup", authController.signup);

// Login route
router.post("/login", authController.login);

// Signout route
router.use("/signout", authMiddleware, authController.signout);

// Delete account route
router.delete("/delete-account", authMiddleware, authController.deleteAccount);

module.exports = router;
