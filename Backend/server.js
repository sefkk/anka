require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user');
const News = require('./models/news');
const Startup = require('./models/startup');
const Legacy = require('./models/legacy');
const Cookie = require('./models/cookie');
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
    const username = (req.query && req.query.username) || (req.body && req.body.username);
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const trimmedUsername = String(username).trim();
    const user = await User.findOne({ username: trimmedUsername });
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

// ------------------- Check Available Username -------------------
app.get("/api/admin/users/check-username", async (req, res) => {
  try {
    const { baseUsername } = req.query;
    
    if (!baseUsername) {
      return res.status(400).json({ message: "baseUsername is required" });
    }
    
    // Check if base username exists
    let existingUser = await User.findOne({ username: baseUsername.trim() });
    
    // If base username doesn't exist, return it
    if (!existingUser) {
      return res.json({ available: true, username: baseUsername.trim() });
    }
    
    // If base username exists, find the next available numbered version
    let counter = 2;
    let suggestedUsername = `${baseUsername.trim()}${counter}`;
    
    // Keep checking until we find an available username (max 100 attempts)
    while (counter <= 100) {
      existingUser = await User.findOne({ username: suggestedUsername });
      if (!existingUser) {
        return res.json({ available: false, username: suggestedUsername });
      }
      counter++;
      suggestedUsername = `${baseUsername.trim()}${counter}`;
    }
    
    // If we couldn't find one in 100 attempts, return error
    return res.status(500).json({ message: "Could not find available username" });
  } catch (err) {
    console.error("❌ Failed to check username:", err.message);
    res.status(500).json({ message: "Failed to check username", error: err.message });
  }
});

// ------------------- Add User (Admin Only) -------------------
app.post("/api/admin/users", async (req, res) => {
  try {
    const { name, surname, username: newUsername, password, gender, major, uni, yob, email, cvLink, isAdmin, adminUsername } = req.body;
    
    console.log(`Add user request - Admin: ${adminUsername}, New User: ${name} ${surname}, Username: ${newUsername}`);
    
    // Check admin authentication
    const adminUser = await User.findOne({ username: (adminUsername || req.body.username || req.query.username || '').trim() });
    if (!adminUser || adminUser.isAdmin !== true) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    // Validate required fields
    if (!name || !surname || !newUsername || !password) {
      return res.status(400).json({ message: "Name, surname, username, and password are required" });
    }
    
    // Check if username already exists
    const existingUser = await User.findOne({ username: newUsername.trim() });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    // Create user object
    const userData = {
      name: name.trim(),
      surname: surname.trim(),
      username: newUsername.trim(),
      password: password.trim()
    };
    
    // Add optional fields if provided
    if (gender) userData.gender = gender.trim();
    if (major) userData.major = major.trim();
    if (uni) userData.uni = uni.trim();
    if (yob) userData.yob = yob.trim();
    if (email) userData.email = email.trim();
    if (cvLink) userData.cvLink = cvLink.trim();
    if (isAdmin === true) userData.isAdmin = true; // Only set if explicitly true
    
    const newUser = new User(userData);
    await newUser.save();
    
    console.log(`✅ User created successfully: ${newUsername}`);
    res.status(201).json({ message: "User created successfully", user: { username: newUser.username, name: newUser.name } });
  } catch (err) {
    console.error("❌ Failed to create user:", err.message);
    console.error("❌ Error stack:", err.stack);
    res.status(500).json({ message: "Failed to create user", error: err.message });
  }
});

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
    const username = (req.query && req.query.username) || (req.body && req.body.username);
    
    console.log(`Delete news request - ID: ${id}`);
    console.log(`Query params:`, req.query);
    console.log(`Body:`, req.body);
    console.log(`Username:`, username);
    
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    
    // Validate MongoDB ObjectId format
    if (!id) {
      return res.status(400).json({ message: "News ID is required" });
    }
    
    // Check if it's a valid MongoDB ObjectId (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error(`Invalid news ID format: ${id}`);
      return res.status(400).json({ message: "Invalid news ID format" });
    }
    
    const trimmedUsername = String(username).trim();
    console.log(`Looking up user: ${trimmedUsername}`);
    
    const user = await User.findOne({ username: trimmedUsername });
    console.log(`User found:`, !!user, user ? `isAdmin: ${user.isAdmin}` : 'not found');
    
    if (!user || user.isAdmin !== true) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    console.log(`Attempting to delete news with ID: ${id}`);
    console.log(`News model available:`, !!News);
    
    const news = await News.findByIdAndDelete(id);
    console.log(`News delete result:`, news ? 'Found and deleted' : 'Not found');
    
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    
    console.log(`News deleted successfully: ${id}`);
    res.json({ message: "News deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete news:", err.message);
    console.error("❌ Error stack:", err.stack);
    console.error("❌ Full error:", err);
    res.status(500).json({ message: "Failed to delete news", error: err.message });
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
    const username = (req.query && req.query.username) || (req.body && req.body.username);
    
    console.log(`Delete startup request - ID: ${id}`);
    console.log(`Query params:`, req.query);
    console.log(`Body:`, req.body);
    console.log(`Username:`, username);
    
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    
    // Validate MongoDB ObjectId format
    if (!id) {
      return res.status(400).json({ message: "Startup ID is required" });
    }
    
    // Check if it's a valid MongoDB ObjectId (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error(`Invalid startup ID format: ${id}`);
      return res.status(400).json({ message: "Invalid startup ID format" });
    }
    
    const trimmedUsername = String(username).trim();
    console.log(`Looking up user: ${trimmedUsername}`);
    
    const user = await User.findOne({ username: trimmedUsername });
    console.log(`User found:`, !!user, user ? `isAdmin: ${user.isAdmin}` : 'not found');
    
    if (!user || user.isAdmin !== true) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    console.log(`Attempting to delete startup with ID: ${id}`);
    console.log(`Startup model available:`, !!Startup);
    
    const startup = await Startup.findByIdAndDelete(id);
    console.log(`Startup delete result:`, startup ? 'Found and deleted' : 'Not found');
    
    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }
    
    console.log(`Startup deleted successfully: ${id}`);
    res.json({ message: "Startup deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete startup:", err.message);
    console.error("❌ Error stack:", err.stack);
    console.error("❌ Full error:", err);
    res.status(500).json({ message: "Failed to delete startup", error: err.message });
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
    const username = (req.query && req.query.username) || (req.body && req.body.username);
    
    console.log(`Delete company request - ID: ${id}`);
    console.log(`Query params:`, req.query);
    console.log(`Body:`, req.body);
    console.log(`Username:`, username);
    
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    
    // Validate MongoDB ObjectId format
    if (!id) {
      return res.status(400).json({ message: "Company ID is required" });
    }
    
    // Check if it's a valid MongoDB ObjectId (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error(`Invalid company ID format: ${id}`);
      return res.status(400).json({ message: "Invalid company ID format" });
    }
    
    const trimmedUsername = String(username).trim();
    console.log(`Looking up user: ${trimmedUsername}`);
    
    const user = await User.findOne({ username: trimmedUsername });
    console.log(`User found:`, !!user, user ? `isAdmin: ${user.isAdmin}` : 'not found');
    
    if (!user || user.isAdmin !== true) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    console.log(`Attempting to delete company with ID: ${id}`);
    console.log(`Company model available:`, !!Company);
    
    const company = await Company.findByIdAndDelete(id);
    console.log(`Company delete result:`, company ? 'Found and deleted' : 'Not found');
    
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    console.log(`Company deleted successfully: ${id}`);
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete company:", err.message);
    console.error("❌ Error stack:", err.stack);
    console.error("❌ Full error:", err);
    res.status(500).json({ message: "Failed to delete company", error: err.message });
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

// ------------------- LEGACY API -------------------
app.get("/api/legacy", async (req, res) => {
  try {
    console.log("📜 /api/legacy endpoint called");
    
    // Check if Legacy model is available
    if (!Legacy) {
      console.error("❌ Legacy model is not available");
      return res.status(500).json({ message: "Legacy model not available", members: [] });
    }
    
    const members = await Legacy.find().sort({ year: -1, createdAt: -1 });
    console.log(`✅ Found ${members.length} legacy members`);
    
    // Always return an array, even if empty
    res.json(members || []);
  } catch (err) {
    console.error("❌ Failed to fetch legacy members:", err);
    // Return empty array instead of error to prevent frontend crashes
    res.status(200).json([]);
  }
});

app.post("/api/admin/legacy", checkAdmin, async (req, res) => {
  try {
    const { name, position, year, category, subcategory, image, linkedin } = req.body;
    if (!name || !position || !year || !category) {
      return res.status(400).json({ message: "Name, position, year, and category are required" });
    }
    
    // Validate category
    if (!['board', 'vice-chair', 'committee'].includes(category)) {
      return res.status(400).json({ message: "Category must be 'board', 'vice-chair', or 'committee'" });
    }
    
    // Validate subcategory if category is committee
    if (category === 'committee' && subcategory) {
      const validSubcategories = ['it', 'marketing', 'entrepreneurship', 'academic', 'event', 'hr', 'law', 'int-relations'];
      if (!validSubcategories.includes(subcategory)) {
        return res.status(400).json({ message: "Invalid subcategory for committee" });
      }
    }
    
    const legacy = new Legacy({ name, position, year, category, subcategory, image, linkedin });
    await legacy.save();
    res.status(201).json({ message: "Legacy member added successfully", legacy });
  } catch (err) {
    console.error("Failed to add legacy member:", err);
    res.status(500).json({ message: "Failed to add legacy member" });
  }
});

app.delete("/api/admin/legacy/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const username = (req.query && req.query.username) || (req.body && req.body.username);
    
    console.log(`Delete legacy member request - ID: ${id}`);
    
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    
    // Validate MongoDB ObjectId format
    if (!id) {
      return res.status(400).json({ message: "Legacy member ID is required" });
    }
    
    // Check if it's a valid MongoDB ObjectId (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error(`Invalid legacy member ID format: ${id}`);
      return res.status(400).json({ message: "Invalid legacy member ID format" });
    }
    
    const trimmedUsername = String(username).trim();
    const user = await User.findOne({ username: trimmedUsername });
    
    if (!user || user.isAdmin !== true) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    const legacy = await Legacy.findByIdAndDelete(id);
    
    if (!legacy) {
      return res.status(404).json({ message: "Legacy member not found" });
    }
    
    console.log(`Legacy member deleted successfully: ${id}`);
    res.json({ message: "Legacy member deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete legacy member:", err.message);
    res.status(500).json({ message: "Failed to delete legacy member", error: err.message });
  }
});

// ------------------- User Info API (for cookie consent) -------------------
app.get("/api/user-info", async (req, res) => {
  try {
    // Get IP address from request
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || 
                     req.headers['x-real-ip'] || 
                     req.connection?.remoteAddress || 
                     req.socket?.remoteAddress ||
                     'Unknown';
    
    // Try to get country from IP (simplified - you might want to use a geolocation service)
    // For now, we'll return Unknown and let frontend handle it if needed
    const country = req.headers['cf-ipcountry'] || // Cloudflare header
                    req.headers['x-country-code'] || // Custom header
                    'Unknown';
    
    res.json({
      ipAddress: ipAddress.trim(),
      country: country
    });
  } catch (err) {
    console.error("Failed to get user info:", err);
    res.json({
      ipAddress: 'Unknown',
      country: 'Unknown'
    });
  }
});

// ------------------- Cookie Data API -------------------
app.post("/api/cookies", async (req, res) => {
  try {
    const { ipAddress, country, loginTimestamp, deviceBrand, deviceType, connectionType, userAgent, consentStatus } = req.body;
    
    const cookieData = new Cookie({
      ipAddress: ipAddress || 'Unknown',
      country: country || 'Unknown',
      loginTimestamp: loginTimestamp ? new Date(loginTimestamp) : new Date(),
      deviceBrand: deviceBrand || 'Unknown',
      deviceType: deviceType || 'Unknown',
      connectionType: connectionType || 'Unknown',
      userAgent: userAgent || 'Unknown',
      consentStatus: consentStatus || 'unknown'
    });
    
    await cookieData.save();
    console.log(`✅ Cookie data saved: ${consentStatus} - ${ipAddress} - ${country}`);
    res.status(201).json({ message: "Cookie data saved successfully" });
  } catch (err) {
    console.error("❌ Failed to save cookie data:", err);
    res.status(500).json({ message: "Failed to save cookie data", error: err.message });
  }
});

app.post("/api/cookies/logout", async (req, res) => {
  try {
    const { logoutTimestamp } = req.body;
    
    // Find the most recent cookie entry for this session and update logout timestamp
    // In a real scenario, you might want to match by IP or session ID
    const recentCookie = await Cookie.findOne().sort({ createdAt: -1 });
    
    if (recentCookie && !recentCookie.logoutTimestamp) {
      recentCookie.logoutTimestamp = logoutTimestamp ? new Date(logoutTimestamp) : new Date();
      await recentCookie.save();
      console.log(`✅ Logout timestamp updated for cookie: ${recentCookie._id}`);
      res.json({ message: "Logout timestamp updated successfully" });
    } else {
      res.json({ message: "No active session found" });
    }
  } catch (err) {
    console.error("❌ Failed to update logout timestamp:", err);
    res.status(500).json({ message: "Failed to update logout timestamp", error: err.message });
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



