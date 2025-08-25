// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user');
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors());

// The Login Endpoint
app.post('/login', async (req, res) => {
    console.log("a");
    const { username, password } = req.body;
    console.log("b");
    try {
        console.log("c");
        const user = await User.findOne({ username });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        console.log("d");
        res.status(500).json({ message: 'Server error' });
    }
});

// Correct connection logic: Wait for the database connection before starting the server
const connectDB = async () => {
    try {
        console.log("e");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("f");
        console.log('Connected to MongoDB');

        // Only start the server after a successful connection
        app.listen(PORT, () => {
            console.log("g");
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.log("h");
        console.error('Could not connect to MongoDB:', error);
        process.exit(1);
    }
};

connectDB();