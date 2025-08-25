const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user'); // Your User model
require('dotenv').config();

const createNewUser = async (name, surname, username, password) => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('Username already exists. Please choose another.');
            return;
        }

        // Create a new user instance
        const newUser = new User({ name, surname, username, password });
        
        // Save the user (the password will be hashed automatically by the pre-save middleware)
        await newUser.save();
        
        console.log(`User '${username}' created successfully!`);
        
    } catch (error) {
        console.error('Error creating user:', error);
    } finally {
        // Disconnect from MongoDB
        mongoose.disconnect();
    }
};

// Example usage:
// Replace these with the actual data from your HR committee
createNewUser('Orkun', 'Sefik', 'orkunsefik', 'temp1234');