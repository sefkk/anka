
// models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // The correct way to import the library

// Define the User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;