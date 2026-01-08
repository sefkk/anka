const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  name: String,
  description: String,
  industry: String,
  website: String,
  logoUrl: String,
  detailPageUrl: String, // Path to detail page like "Online_Startup_Companies/araci-payi.html"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Startup", startupSchema, "startups");

