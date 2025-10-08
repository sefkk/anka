require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user'); // Make sure the file name matches
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "*", // for testing; later restrict to your frontend URL
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
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = await User.findOne({ username: username.trim() });
        if (!user || user.password !== password.trim()) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Successful login
        res.status(200).json({ message: 'Login successful', name: user.name });
    } catch (err) {
        console.error('Login route error:', err);
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
        console.error('Failed to fetch companies:', err);
        res.status(500).json({ message: "Failed to fetch companies" });
    }
});

// ------------------- Connect to MongoDB & Start Server -------------------
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => {
    console.error('❌ Could not connect to MongoDB:', err);
    process.exit(1);
});
