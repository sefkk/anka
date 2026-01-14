
// models/user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  username: String,
  password: String,
  gender: String,
  major: String,
  uni: String,
  yob: String,
  email: String,
  cvLink: String,
  isAdmin: Boolean,  // Sadece admin kullanıcılarda true olacak
  isMaster: Boolean, // Sadece master admin (IT) kullanıcılarda true olacak
  canTalentPool: { type: Boolean, default: false },
  canStartups: { type: Boolean, default: false },
  canNews: { type: Boolean, default: false },
  canLegacy: { type: Boolean, default: false },
  canUsers: { type: Boolean, default: false },
  canLogs: { type: Boolean, default: false }
});

// 3. parametre olarak koleksiyon adını belirtiyoruz
module.exports = mongoose.model("User", userSchema, "users");
