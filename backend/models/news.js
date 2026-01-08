const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  date: String, // Format: "Feb 26, 2025"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("News", newsSchema, "news");

