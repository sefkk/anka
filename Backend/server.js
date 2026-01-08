require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user');
const News = require('./models/news');
const Startup = require('./models/startup');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "*", // for testing; later restrict to your frontend URL
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ------------------- Admin Middleware -------------------
const checkAdmin = async (req, res, next) => {
  try {
    const username = req.body.username || req.query.username;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const user = await User.findOne({ username: username.trim() });
    if (!user || user.isAdmin !== true) {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.adminUser = user; // Store admin user in request
    next();
  } catch (err) {
    console.error("Admin check error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

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

        // Debug: Check isAdmin value - detailed logging
        console.log(`\n=== LOGIN DEBUG for ${username} ===`);
        console.log('Full user object:', JSON.stringify(user.toObject(), null, 2));
        console.log('isAdmin value:', user.isAdmin);
        console.log('isAdmin type:', typeof user.isAdmin);
        console.log('isAdmin === true:', user.isAdmin === true);
        console.log('isAdmin == true:', user.isAdmin == true);
        console.log('Boolean(user.isAdmin):', Boolean(user.isAdmin));
        console.log('================================\n');

        // Successful login
        const isAdminResult = user.isAdmin === true;
        res.status(200).json({ 
            message: 'Login successful', 
            name: user.name,
            isAdmin: isAdminResult
        });
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

// ==================== ADMIN ROUTES ====================

// ------------------- Check Admin Status -------------------
app.post("/api/admin/check", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ isAdmin: user.isAdmin === true });
  } catch (err) {
    console.error("Admin check error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- NEWS API -------------------
app.get("/api/news", async (req, res) => {
  try {
    console.log("📰 /api/news endpoint called");
    
    // Check if News model is available
    if (!News) {
      console.error("❌ News model is not available");
      return res.status(500).json({ message: "News model not available", news: [] });
    }
    
    const news = await News.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${news.length} news items`);
    
    // Always return an array, even if empty
    res.json(news || []);
  } catch (err) {
    console.error("❌ Failed to fetch news:", err);
    // Return empty array instead of error to prevent frontend crashes
    res.status(200).json([]);
  }
});

app.post("/api/admin/news", checkAdmin, async (req, res) => {
  try {
    const { title, description, imageUrl, date } = req.body;
    if (!title || !description || !imageUrl || !date) {
      return res.status(400).json({ message: "Title, description, imageUrl, and date are required" });
    }
    const news = new News({ title, description, imageUrl, date });
    await news.save();
    res.status(201).json({ message: "News added successfully", news });
  } catch (err) {
    console.error("Failed to add news:", err);
    res.status(500).json({ message: "Failed to add news" });
  }
});

app.delete("/api/admin/news/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const username = req.body.username || req.query.username;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const user = await User.findOne({ username: username.trim() });
    if (!user || user.isAdmin !== true) {
      return res.status(403).json({ message: "Admin access required" });
    }
    const news = await News.findByIdAndDelete(id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json({ message: "News deleted successfully" });
  } catch (err) {
    console.error("Failed to delete news:", err);
    res.status(500).json({ message: "Failed to delete news" });
  }
});

// ------------------- STARTUP API -------------------
app.get("/api/startups", async (req, res) => {
  try {
    const startups = await Startup.find().sort({ createdAt: -1 });
    res.json(startups);
  } catch (err) {
    console.error("Failed to fetch startups:", err);
    res.status(500).json({ message: "Failed to fetch startups" });
  }
});

app.post("/api/admin/startups", checkAdmin, async (req, res) => {
  try {
    const { name, description, industry, website, logoUrl, detailPageUrl } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }
    const startup = new Startup({ name, description, industry, website, logoUrl, detailPageUrl });
    await startup.save();
    res.status(201).json({ message: "Startup added successfully", startup });
  } catch (err) {
    console.error("Failed to add startup:", err);
    res.status(500).json({ message: "Failed to add startup" });
  }
});

app.delete("/api/admin/startups/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const username = req.body.username || req.query.username;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const user = await User.findOne({ username: username.trim() });
    if (!user || user.isAdmin !== true) {
      return res.status(403).json({ message: "Admin access required" });
    }
    const startup = await Startup.findByIdAndDelete(id);
    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }
    res.json({ message: "Startup deleted successfully" });
  } catch (err) {
    console.error("Failed to delete startup:", err);
    res.status(500).json({ message: "Failed to delete startup" });
  }
});

// ------------------- TALENT POOL ADMIN API -------------------
app.post("/api/admin/companies", checkAdmin, async (req, res) => {
  try {
    const { name, industry, description_short, description_long, headquarters, website, logo_url, apply_url, experience, jobtype } = req.body;
    if (!name || !industry || !description_short) {
      return res.status(400).json({ message: "Name, industry, and description_short are required" });
    }
    const company = new Company({ 
      name, industry, description_short, description_long, 
      headquarters, website, logo_url, apply_url, experience, jobtype,
      applicants: []
    });
    await company.save();
    res.status(201).json({ message: "Company/Job posting added successfully", company });
  } catch (err) {
    console.error("Failed to add company:", err);
    res.status(500).json({ message: "Failed to add company" });
  }
});

app.delete("/api/admin/companies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const username = req.body.username || req.query.username;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const user = await User.findOne({ username: username.trim() });
    if (!user || user.isAdmin !== true) {
      return res.status(403).json({ message: "Admin access required" });
    }
    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    console.error("Failed to delete company:", err);
    res.status(500).json({ message: "Failed to delete company" });
  }
});

app.get("/api/admin/companies/:companyName/applicants", async (req, res) => {
  try {
    const { companyName } = req.params;
    const username = req.query.username;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const user = await User.findOne({ username: username.trim() });
    if (!user || user.isAdmin !== true) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    const company = await Company.findOne({ name: new RegExp(`^${companyName}$`, "i") });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    // Get user details for applicants
    const applicants = company.applicants || [];
    const applicantDetails = await Promise.all(
      applicants.map(async (applicantUsername) => {
        const applicantUser = await User.findOne({ username: applicantUsername });
        return applicantUser ? {
          username: applicantUser.username,
          name: applicantUser.name,
          surname: applicantUser.surname,
          cvLink: applicantUser.cvLink || null
        } : { username: applicantUsername, name: "Unknown", surname: "", cvLink: null };
      })
    );
    
    res.json({ 
      companyName: company.name,
      applicants: applicantDetails 
    });
  } catch (err) {
    console.error("Failed to fetch applicants:", err);
    res.status(500).json({ message: "Failed to fetch applicants" });
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



