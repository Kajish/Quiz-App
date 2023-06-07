// models/token.js
const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
  },
  { capped: { size: 1024, max: 20, autoIndexId: true } }
);

module.exports = mongoose.model("Token", tokenSchema);
