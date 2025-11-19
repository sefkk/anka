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

// ------------------- Get user by username -------------------
app.get('/api/users', async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...safeUser } = user.toObject();
    res.json(safeUser);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Update CV Link -------------------
app.post("/api/users/update-cv", async (req, res) => {
  try {
    const { username, cvLink } = req.body;

    if (!username || !cvLink) {
      return res.status(400).json({ message: "username and cvLink required" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: username.trim() },
      { cvLink },        // save CV URL in MongoDB
      { new: true }      // return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "CV link saved", cvLink: updatedUser.cvLink });
  } catch (err) {
    console.error("❌ CV update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Change Password -------------------
app.post("/api/users/change-password", async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "username, oldPassword, and newPassword are required" });
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare old password with stored password
    if (user.password !== oldPassword.trim()) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Update password
    user.password = newPassword.trim();
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("❌ Password change error:", err);
    res.status(500).json({ message: "Server error" });
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
    jobtype: String,
    applicants: { type: [String], default: [] }
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

// ------------------- Apply to Company -------------------
app.post("/api/apply", async (req, res) => {
  try {
    const { companyName, username } = req.body;
    console.log("📥 Received apply request:", req.body);

    if (!companyName || !username) {
      return res.status(400).json({ message: "Missing companyName or username" });
    }

    const company = await Company.findOne({ name: new RegExp(`^${companyName}$`, "i") });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Ensure applicants is an array
    if (!Array.isArray(company.applicants)) {
      console.log(`⚙️ Fixing applicants type for ${company.name}`);
      company.applicants = company.applicants ? [company.applicants] : [];
    }

    if (!company.applicants.includes(username)) {
      company.applicants.push(username);
      await company.save();
    }

    console.log(`✅ ${username} successfully applied to ${company.name}`);
    res.status(200).json({
      message: `Successfully applied to ${company.name}`,
      applicants: company.applicants,
    });

  } catch (err) {
    console.error("🔥 Apply route error:", err.message, err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
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



