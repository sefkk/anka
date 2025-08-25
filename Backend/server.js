// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user'); // Correct path
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors());

// The Login Endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// -------------------------------------------------------------
// This is the most crucial part. Start the server AFTER connecting to the database.
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Could not connect to MongoDB:', error);
        process.exit(1);
    }
};

connectDB();
// -------------------------------------------------------------