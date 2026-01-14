
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
  isMaster: Boolean // Sadece master admin (IT) kullanıcılarda true olacak
});

// 3. parametre olarak koleksiyon adını belirtiyoruz
module.exports = mongoose.model("User", userSchema, "users");
