const mongoose = require('mongoose');

const cookieSchema = new mongoose.Schema({
  ipAddress: String,
  country: String,
  loginTimestamp: Date,
  logoutTimestamp: Date,
  deviceBrand: String, // Apple, Android, etc.
  deviceType: String, // web, phone, tablet, etc.
  connectionType: String, // wifi, cellular, etc.
  userAgent: String,
  consentStatus: String, // 'accepted' or 'rejected'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cookie", cookieSchema, "cookies");
