
// server.js
require('dotenv').config(); // Load environment variables
const express = require('../.gitignore/node_modules/express');
const mongoose = require('mongoose');
const cors = require('../.gitignore/node_modules/cors/lib'); // Import the cors package
// Use a relative path to your user.js file.
const User = require('./models/user'); // Import the User model
const app = express();
const PORT = process.env.PORT; // This will use the port Render assigns

// Middleware 
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// The Login Endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Find the user by username
        const user = await User.findOne({ username });

        // If user not found or password doesn't match
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // 2. Passwords match, return a success message
        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});