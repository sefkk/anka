const mongoose = require('mongoose');

const legacySchema = new mongoose.Schema({
  name: String,
  position: String,
  year: String, // e.g., "2024"
  category: { 
    type: String, 
    enum: ['board', 'vice-chair', 'committee'],
    required: true 
  },
  subcategory: { 
    type: String, 
    enum: ['it', 'marketing', 'entrepreneurship', 'academic', 'event', 'hr', 'law', 'int-relations'],
    required: false // Only required for committee category
  },
  image: String, // Path to image
  linkedin: String, // LinkedIn URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Legacy", legacySchema, "legacy-members");
