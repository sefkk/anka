
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
  cvLink: String
});

// 3. parametre olarak koleksiyon adını belirtiyoruz
module.exports = mongoose.model("User", userSchema, "users");
