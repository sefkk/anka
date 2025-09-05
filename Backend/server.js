// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user'); // your User model

const app = express();
const PORT = process.env.PORT || 5000; // Render sets process.env.PORT automatically

// Middleware
app.use(cors({
    origin: "*", // for testing; later restrict to your frontend Render URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// Test route (to verify Render is serving correctly)
app.get('/', (req, res) => {
    res.send("✅ Backend is running");
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const username = req.body.username?.trim();
        const password = req.body.password?.trim();

        console.log('Received username:', username);
        console.log('Received password:', password);

        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Make sure your User model defines .matchPassword correctly (bcrypt compare)
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            console.log('Password does not match!');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        console.log('Login successful for:', username);
        // Corrected line: Include the user's name in the response
        res.status(200).json({ 
            message: 'Login successful', 
            name: user.name  // <-- This sends the name
        });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Connect to MongoDB and start server
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Start listening AFTER successful DB connection
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error('❌ Could not connect to MongoDB:', err);
        process.exit(1);
    }
};

connectDB();
