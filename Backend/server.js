// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user'); // Your User model

const app = express();
const PORT = process.env.PORT || 5000; // Render sets process.env.PORT automatically

// Middleware
app.use(cors({
    origin: "*", // for testing; later restrict to your frontend Render URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ------------------- Test route -------------------
app.get('/', (req, res) => {
    res.send("✅ Backend is running");
});

// ------------------- Login route -------------------
app.post('/login', async (req, res) => {
    try {
        const username = req.body.username?.trim();
        const password = req.body.password?.trim();

        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid username or password' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

        res.status(200).json({ message: 'Login successful', name: user.name });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ------------------- Company model -------------------
const companySchema = new mongoose.Schema({
    name: String,
    industry: String,
    description_short: String,
    description_long: String,
    headquarters: String,
    website: String,
    logo_url: String,
    apply_url: String,
    experience: String,
    jobtype: String
});
const Company = mongoose.model("Company", companySchema, "talentpool-companies-data");

// ------------------- Companies API -------------------
app.get("/api/companies", async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch companies" });
    }
});

// ------------------- Connect to MongoDB & Start Server -------------------
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error('❌ Could not connect to MongoDB:', err);
        process.exit(1);
    }
};

connectDB();
