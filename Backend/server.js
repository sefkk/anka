require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const User = require('./models/user');
const News = require('./models/news');
const Startup = require('./models/startup');
const Legacy = require('./models/legacy');
const Cookie = require('./models/cookie');
const AdminLog = require('./models/adminLog');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "*", // for testing; later restrict to your frontend URL
    methods: ["GET", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ------------------- Admin Middleware -------------------
const getAuthUsername = (req) => {
  return (
    (req.body && (req.body.adminUsername || req.body.username)) ||
    (req.query && req.query.username) ||
    null
  );
};

const requireAdminPermission = (permission) => async (req, res, next) => {
  try {
    const username = getAuthUsername(req);
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const trimmedUsername = String(username).trim();
    const user = await User.findOne({ username: trimmedUsername });
    if (!user || user.isAdmin !== true) {
      return res.status(403).json({ message: "Admin access required" });
    }

    if (permission && user.isMaster !== true && user[permission] !== true) {
      return res.status(403).json({ message: "Permission required" });
    }

    req.adminUser = user;
    next();
  } catch (err) {
    console.error("Admin check error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const requireMasterAdmin = async (req, res, next) => {
  try {
    const username = getAuthUsername(req);
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const trimmedUsername = String(username).trim();
    const user = await User.findOne({ username: trimmedUsername });
    if (!user || user.isAdmin !== true || user.isMaster !== true) {
      return res.status(403).json({ message: "Master admin access required" });
    }

    req.adminUser = user;
    next();
  } catch (err) {
    console.error("Master admin check error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------- Committee Helpers -------------------
const COMMITTEE_CONFIG = {
  it: {
    id: 'it',
    label: 'IT Committee',
    filePath: path.join(__dirname, '..', 'Commitees', 'it.html'),
    i18nPrefix: 'committee_it',
    classSuffix: 'it',
    permission: 'canCommitteeIt'
  },
  marketing: {
    id: 'marketing',
    label: 'Marketing Committee',
    filePath: path.join(__dirname, '..', 'Commitees', 'marketing.html'),
    i18nPrefix: 'committee_marketing',
    classSuffix: 'marketing',
    permission: 'canCommitteeMarketing'
  },
  entrepreneurship: {
    id: 'entrepreneurship',
    label: 'Entrepreneurship & Business Committee',
    filePath: path.join(__dirname, '..', 'Commitees', 'entrepreneurship.html'),
    i18nPrefix: 'committee_entre',
    classSuffix: 'entre',
    permission: 'canCommitteeEntrepreneurship'
  },
  academic: {
    id: 'academic',
    label: 'Academic Support Committee',
    filePath: path.join(__dirname, '..', 'Commitees', 'academic.html'),
    i18nPrefix: 'committee_academic',
    classSuffix: 'academic',
    permission: 'canCommitteeAcademic'
  },
  event: {
    id: 'event',
    label: 'Event Planning Committee',
    filePath: path.join(__dirname, '..', 'Commitees', 'event.html'),
    i18nPrefix: 'committee_event',
    classSuffix: 'event',
    permission: 'canCommitteeEvent'
  },
  hr: {
    id: 'hr',
    label: 'HR Committee',
    filePath: path.join(__dirname, '..', 'Commitees', 'hr.html'),
    i18nPrefix: 'committee_hr',
    classSuffix: 'hr',
    permission: 'canCommitteeHr'
  },
  law: {
    id: 'law',
    label: 'Law Committee',
    filePath: path.join(__dirname, '..', 'Commitees', 'law.html'),
    i18nPrefix: 'committee_law',
    classSuffix: 'law',
    permission: 'canCommitteeLaw'
  },
  'int-relations': {
    id: 'int-relations',
    label: 'International Relations Committee',
    filePath: path.join(__dirname, '..', 'Commitees', 'int-relations.html'),
    i18nPrefix: 'committee_ir',
    classSuffix: 'int-relations',
    permission: 'canCommitteeIntRelations'
  }
};

const I18N_PATH = path.join(__dirname, '..', 'i18n.js');

const getCommitteeConfig = (id) => COMMITTEE_CONFIG[id] || null;

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const escapeJsString = (value) => String(value || '')
  .replace(/\\/g, '\\\\')
  .replace(/'/g, "\\'")
  .replace(/\r?\n/g, '\\n');

const unescapeJsString = (value) => String(value || '')
  .replace(/\\n/g, '\n')
  .replace(/\\'/g, "'")
  .replace(/\\"/g, '"')
  .replace(/\\\\/g, '\\');

const escapeHtml = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const findObjectBlock = (source, label) => {
  const labelIndex = source.indexOf(`${label}:`);
  if (labelIndex === -1) return null;
  const braceStart = source.indexOf('{', labelIndex);
  if (braceStart === -1) return null;
  let depth = 0;
  for (let i = braceStart; i < source.length; i += 1) {
    const char = source[i];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return { start: braceStart, end: i };
      }
    }
  }
  return null;
};

const parseTranslationBlock = (blockContent) => {
  const translations = {};
  const entryRegex = /['"]([^'"]+)['"]\s*:\s*(['"])((?:\\.|(?!\2)[\s\S])*)\2\s*(?:,|$)/g;
  let match;
  while ((match = entryRegex.exec(blockContent)) !== null) {
    translations[match[1]] = unescapeJsString(match[3]);
  }
  return translations;
};

const upsertTranslations = (source, label, updates) => {
  const bounds = findObjectBlock(source, label);
  if (!bounds) return source;
  let blockContent = source.slice(bounds.start + 1, bounds.end);
  Object.entries(updates).forEach(([key, value]) => {
    const escapedValue = escapeJsString(value);
    const keyRegex = new RegExp(`([\\s\\n])['"]${escapeRegExp(key)}['"]\\s*:\\s*(['"])(?:\\\\.|(?!\\2)[\\s\\S])*?\\2`, 'g');
    if (keyRegex.test(blockContent)) {
      blockContent = blockContent.replace(keyRegex, `$1'${key}': '${escapedValue}'`);
    } else {
      const trimmed = blockContent.replace(/\s*$/, '');
      const trailing = blockContent.slice(trimmed.length);
      blockContent = `${trimmed}\n      '${key}': '${escapedValue}',${trailing}`;
    }
  });
  return `${source.slice(0, bounds.start + 1)}${blockContent}${source.slice(bounds.end)}`;
};

const parseCommitteeHtml = (html, config) => {
  const members = [];
  const responsibilities = [];
  const teamGridMatch = html.match(/<div class="team-grid">([\s\S]*?)<\/div>\s*<\/section>/);
  if (teamGridMatch) {
    const teamGridHtml = teamGridMatch[1];
    const memberRegex = /<div class="team-member[^"]*">([\s\S]*?)<\/div>/g;
    let memberMatch;
    while ((memberMatch = memberRegex.exec(teamGridHtml)) !== null) {
      const memberHtml = memberMatch[1];
      const imageMatch = memberHtml.match(/<img[^>]*src="([^"]+)"[^>]*>/);
      const nameMatch = memberHtml.match(/<h3>([\s\S]*?)<\/h3>/);
      const roleKeyMatch = memberHtml.match(/data-i18n="([^"]+)"/);
      const roleTextMatch = memberHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/);
      members.push({
        name: nameMatch ? nameMatch[1].trim() : '',
        image: imageMatch ? imageMatch[1].trim() : '',
        roleKey: roleKeyMatch ? roleKeyMatch[1].trim() : '',
        roleText: roleTextMatch ? roleTextMatch[1].trim() : ''
      });
    }
  }

  const responsibilitiesMatch = html.match(/<section class="responsibilities[^"]*">[\s\S]*?<ul>([\s\S]*?)<\/ul>/);
  if (responsibilitiesMatch) {
    const listHtml = responsibilitiesMatch[1];
    const itemRegex = /<li[^>]*data-i18n="([^"]+)"[^>]*>([\s\S]*?)<\/li>/g;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(listHtml)) !== null) {
      responsibilities.push({
        key: itemMatch[1].trim(),
        text: itemMatch[2].trim()
      });
    }
  }

  return { members, responsibilities };
};

const buildTeamHtml = (config, members) => {
  return members.map((member, index) => {
    const roleKey = `${config.i18nPrefix}.team.member${index + 1}.role`;
    return `
        <div class="team-member team-member-${config.classSuffix}">
          <img src="${escapeHtml(member.image)}" alt="${escapeHtml(member.name)}">
          <h3>${escapeHtml(member.name)}</h3>
          <p data-i18n="${roleKey}">${escapeHtml(member.roleEn)}</p>
        </div>`;
  }).join('');
};

const buildResponsibilitiesHtml = (config, responsibilities) => {
  return responsibilities.map((item, index) => {
    const key = `${config.i18nPrefix}.responsibilities.item${index + 1}`;
    return `
        <li data-i18n="${key}">${escapeHtml(item.en)}</li>`;
  }).join('');
};

const updateCommitteeHtml = (html, config, members, responsibilities) => {
  const teamReplacement = buildTeamHtml(config, members);
  const responsibilitiesReplacement = buildResponsibilitiesHtml(config, responsibilities);
  let updated = html.replace(
    /(<div class="team-grid">)([\s\S]*?)(<\/div>\s*<\/section>)/,
    `$1${teamReplacement}$3`
  );
  updated = updated.replace(
    /(<section class="responsibilities[^"]*">[\s\S]*?<ul>)([\s\S]*?)(<\/ul>)/,
    `$1${responsibilitiesReplacement}$3`
  );
  return updated;
};

const requireCommitteePermission = async (req, res, next) => {
  try {
    const username = getAuthUsername(req);
    const committeeId = req.params.id;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const config = getCommitteeConfig(committeeId);
    if (!config) {
      return res.status(404).json({ message: "Committee not found" });
    }
    const user = await User.findOne({ username: String(username).trim() });
    if (!user || user.isAdmin !== true) {
      return res.status(403).json({ message: "Admin access required" });
    }
    if (user.isMaster !== true && user[config.permission] !== true) {
      return res.status(403).json({ message: "Committee permission required" });
    }
    req.adminUser = user;
    req.committeeConfig = config;
    next();
  } catch (err) {
    console.error("Committee permission error:", err);
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
        const isMasterResult = user.isMaster === true;
        const permissions = {
            canTalentPool: user.canTalentPool === true,
            canStartups: user.canStartups === true,
            canNews: user.canNews === true,
            canLegacy: user.canLegacy === true,
            canUsers: user.canUsers === true,
            canLogs: user.canLogs === true,
            canCommitteeIt: user.canCommitteeIt === true,
            canCommitteeMarketing: user.canCommitteeMarketing === true,
            canCommitteeEntrepreneurship: user.canCommitteeEntrepreneurship === true,
            canCommitteeAcademic: user.canCommitteeAcademic === true,
            canCommitteeEvent: user.canCommitteeEvent === true,
            canCommitteeHr: user.canCommitteeHr === true,
            canCommitteeLaw: user.canCommitteeLaw === true,
            canCommitteeIntRelations: user.canCommitteeIntRelations === true
        };
        res.status(200).json({ 
            message: 'Login successful', 
            name: user.name,
            isAdmin: isAdminResult,
            isMaster: isMasterResult,
            ...permissions
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

// ------------------- Update Profile -------------------
app.post("/api/users/update-profile", async (req, res) => {
  try {
    const { username, name, surname, uni, major, gender, yob, password } = req.body;

    if (!username) {
      return res.status(400).json({ message: "username is required" });
    }

    if (!name || !surname) {
      return res.status(400).json({ message: "name and surname are required" });
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update allowed fields
    user.name = name.trim();
    user.surname = surname.trim();
    if (uni !== undefined) user.uni = uni.trim() || '';
    if (major !== undefined) user.major = major.trim() || '';
    if (gender !== undefined) user.gender = gender.trim() || '';
    if (yob !== undefined) user.yob = yob.trim() || '';
    if (password && password.trim()) {
      user.password = password.trim();
    }

    await user.save();

    const { password: _, ...safeUser } = user.toObject();
    res.status(200).json({ message: "Profile updated successfully", user: safeUser });
  } catch (err) {
    console.error("❌ Profile update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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
app.post("/api/admin/users", requireAdminPermission('canUsers'), async (req, res) => {
  try {
    const { 
      name, surname, username: newUsername, password, gender, major, uni, yob, email, cvLink,
      isAdmin, adminUsername,
      canTalentPool, canStartups, canNews, canLegacy, canUsers, canLogs,
      canCommitteeIt, canCommitteeMarketing, canCommitteeEntrepreneurship,
      canCommitteeAcademic, canCommitteeEvent, canCommitteeHr,
      canCommitteeLaw, canCommitteeIntRelations
    } = req.body;
    
    console.log(`Add user request - Admin: ${adminUsername}, New User: ${name} ${surname}, Username: ${newUsername}`);
    
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
    if (canTalentPool === true) userData.canTalentPool = true;
    if (canStartups === true) userData.canStartups = true;
    if (canNews === true) userData.canNews = true;
    if (canLegacy === true) userData.canLegacy = true;
    if (canUsers === true) userData.canUsers = true;
    if (canLogs === true) userData.canLogs = true;
    if (canCommitteeIt === true) userData.canCommitteeIt = true;
    if (canCommitteeMarketing === true) userData.canCommitteeMarketing = true;
    if (canCommitteeEntrepreneurship === true) userData.canCommitteeEntrepreneurship = true;
    if (canCommitteeAcademic === true) userData.canCommitteeAcademic = true;
    if (canCommitteeEvent === true) userData.canCommitteeEvent = true;
    if (canCommitteeHr === true) userData.canCommitteeHr = true;
    if (canCommitteeLaw === true) userData.canCommitteeLaw = true;
    if (canCommitteeIntRelations === true) userData.canCommitteeIntRelations = true;
    
    const newUser = new User(userData);
    await newUser.save();
    
    // Log admin grant if isAdmin is true, including all granted permissions
    if (isAdmin === true) {
      try {
        const grantedPermissions = [];
        if (isAdmin === true) grantedPermissions.push('isAdmin');
        if (canTalentPool === true) grantedPermissions.push('canTalentPool');
        if (canStartups === true) grantedPermissions.push('canStartups');
        if (canNews === true) grantedPermissions.push('canNews');
        if (canLegacy === true) grantedPermissions.push('canLegacy');
        if (canUsers === true) grantedPermissions.push('canUsers');
        if (canLogs === true) grantedPermissions.push('canLogs');
        if (canCommitteeIt === true) grantedPermissions.push('canCommitteeIt');
        if (canCommitteeMarketing === true) grantedPermissions.push('canCommitteeMarketing');
        if (canCommitteeEntrepreneurship === true) grantedPermissions.push('canCommitteeEntrepreneurship');
        if (canCommitteeAcademic === true) grantedPermissions.push('canCommitteeAcademic');
        if (canCommitteeEvent === true) grantedPermissions.push('canCommitteeEvent');
        if (canCommitteeHr === true) grantedPermissions.push('canCommitteeHr');
        if (canCommitteeLaw === true) grantedPermissions.push('canCommitteeLaw');
        if (canCommitteeIntRelations === true) grantedPermissions.push('canCommitteeIntRelations');
        
        const adminLog = new AdminLog({
          adminUsername: adminUsername.trim(),
          actionType: 'grant_admin',
          details: {
            targetUsername: newUsername.trim(),
            targetName: `${name.trim()} ${surname.trim()}`.trim(),
            method: 'add_user',
            newUser: true,
            grantedPermissions: grantedPermissions,
            permissionsCount: grantedPermissions.length
          },
          timestamp: new Date(),
          ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown',
          userAgent: req.headers['user-agent'] || 'Unknown'
        });
        await adminLog.save();
        console.log(`📝 Admin Log: ${adminUsername} granted admin to ${newUsername} with permissions: ${grantedPermissions.join(', ')}`);
      } catch (logErr) {
        console.error("❌ Failed to log admin grant:", logErr.message);
        // Don't fail the request if logging fails
      }
    }
    
    console.log(`✅ User created successfully: ${newUsername}`);
    res.status(201).json({ message: "User created successfully", user: { username: newUser.username, name: newUser.name } });
  } catch (err) {
    console.error("❌ Failed to create user:", err.message);
    console.error("❌ Error stack:", err.stack);
    res.status(500).json({ message: "Failed to create user", error: err.message });
  }
});

// ------------------- List Users (Master Admin Only) -------------------
app.get("/api/admin/users/list", requireMasterAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    res.json({ users: users || [] });
  } catch (err) {
    console.error("❌ Failed to list users:", err.message);
    res.status(500).json({ message: "Failed to list users", error: err.message });
  }
});

// ------------------- Update User Permissions (Master Admin Only) -------------------
app.patch("/api/admin/users/:username/permissions", requireMasterAdmin, async (req, res) => {
  try {
    const targetUsername = String(req.params.username || "").trim();
    if (!targetUsername) {
      return res.status(400).json({ message: "Target username is required" });
    }

    const allowedFields = [
      "isAdmin",
      "canTalentPool",
      "canStartups",
      "canNews",
      "canLegacy",
      "canUsers",
      "canLogs",
      "canCommitteeIt",
      "canCommitteeMarketing",
      "canCommitteeEntrepreneurship",
      "canCommitteeAcademic",
      "canCommitteeEvent",
      "canCommitteeHr",
      "canCommitteeLaw",
      "canCommitteeIntRelations"
    ];

    const update = {};
    allowedFields.forEach((field) => {
      if (typeof req.body[field] === "boolean") {
        update[field] = req.body[field];
      }
    });

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No permission fields provided" });
    }

    // Get current user state before update to check if admin status is being granted
    const currentUser = await User.findOne({ username: targetUsername });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const wasAdmin = currentUser.isAdmin === true;
    const willBeAdmin = update.isAdmin === true;

    const updatedUser = await User.findOneAndUpdate(
      { username: targetUsername },
      { $set: update },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log admin grant if admin status is being granted (was false, now true)
    // Also track which permissions were granted/revoked
    if (!wasAdmin && willBeAdmin) {
      try {
        const adminUsername = getAuthUsername(req);
        
        // Calculate which permissions were granted
        const grantedPermissions = [];
        const revokedPermissions = [];
        
        allowedFields.forEach((field) => {
          const wasSet = currentUser[field] === true;
          const willBeSet = update[field] === true;
          
          if (!wasSet && willBeSet) {
            grantedPermissions.push(field);
          } else if (wasSet && !willBeSet) {
            revokedPermissions.push(field);
          }
        });
        
        const adminLog = new AdminLog({
          adminUsername: adminUsername ? adminUsername.trim() : 'Unknown',
          actionType: 'grant_admin',
          details: {
            targetUsername: targetUsername,
            targetName: `${updatedUser.name || ''} ${updatedUser.surname || ''}`.trim() || targetUsername,
            method: 'update_permissions',
            newUser: false,
            grantedPermissions: grantedPermissions,
            revokedPermissions: revokedPermissions,
            permissionsCount: grantedPermissions.length
          },
          timestamp: new Date(),
          ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown',
          userAgent: req.headers['user-agent'] || 'Unknown'
        });
        await adminLog.save();
        console.log(`📝 Admin Log: ${adminUsername || 'Unknown'} granted admin to ${targetUsername}`);
        if (grantedPermissions.length > 0) {
          console.log(`   Granted: ${grantedPermissions.join(', ')}`);
        }
        if (revokedPermissions.length > 0) {
          console.log(`   Revoked: ${revokedPermissions.join(', ')}`);
        }
      } catch (logErr) {
        console.error("❌ Failed to log admin grant:", logErr.message);
        // Don't fail the request if logging fails
      }
    }

    const { password, ...safeUser } = updatedUser.toObject();
    res.json({ message: "User permissions updated", user: safeUser });
  } catch (err) {
    console.error("❌ Failed to update user permissions:", err.message);
    res.status(500).json({ message: "Failed to update permissions", error: err.message });
  }
});

// ------------------- Update Ticket Code (Master Admin Only) -------------------
app.patch("/api/admin/users/:username/ticket-code", requireMasterAdmin, async (req, res) => {
  try {
    const targetUsername = String(req.params.username || "").trim();
    if (!targetUsername) {
      return res.status(400).json({ message: "Target username is required" });
    }

    const { ticketCode } = req.body;
    
    if (ticketCode === undefined) {
      return res.status(400).json({ message: "ticketCode is required" });
    }

    const user = await User.findOne({ username: targetUsername });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.ticketCode = ticketCode ? ticketCode.trim() : '';
    await user.save();

    const { password, ...safeUser } = user.toObject();
    res.json({ message: "Ticket code updated successfully", user: safeUser });
  } catch (err) {
    console.error("❌ Failed to update ticket code:", err.message);
    res.status(500).json({ message: "Failed to update ticket code", error: err.message });
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

// ------------------- Committee Admin API -------------------
app.get("/api/admin/committees/:id", requireCommitteePermission, async (req, res) => {
  try {
    const config = req.committeeConfig;
    const html = fs.readFileSync(config.filePath, 'utf8');
    const i18nContent = fs.readFileSync(I18N_PATH, 'utf8');
    const enBounds = findObjectBlock(i18nContent, 'en');
    const trBounds = findObjectBlock(i18nContent, 'tr');
    const enBlock = enBounds ? i18nContent.slice(enBounds.start + 1, enBounds.end) : '';
    const trBlock = trBounds ? i18nContent.slice(trBounds.start + 1, trBounds.end) : '';
    const translationsEn = parseTranslationBlock(enBlock);
    const translationsTr = parseTranslationBlock(trBlock);

    const parsed = parseCommitteeHtml(html, config);
    const members = parsed.members.map((member, index) => {
      const roleKey = member.roleKey || `${config.i18nPrefix}.team.member${index + 1}.role`;
      return {
        name: member.name,
        image: member.image,
        roleKey,
        roleEn: translationsEn[roleKey] || member.roleText || '',
        roleTr: translationsTr[roleKey] || ''
      };
    });
    const responsibilities = parsed.responsibilities.map((item, index) => {
      const key = item.key || `${config.i18nPrefix}.responsibilities.item${index + 1}`;
      return {
        key,
        en: translationsEn[key] || item.text || '',
        tr: translationsTr[key] || ''
      };
    });

    res.json({ committee: { id: config.id, label: config.label }, members, responsibilities });
  } catch (err) {
    console.error("Failed to load committee:", err);
    res.status(500).json({ message: "Failed to load committee", error: err.message });
  }
});

app.patch("/api/admin/committees/:id", requireCommitteePermission, async (req, res) => {
  try {
    const config = req.committeeConfig;
    const { members, responsibilities } = req.body;
    if (!Array.isArray(members) || !Array.isArray(responsibilities)) {
      return res.status(400).json({ message: "members and responsibilities are required arrays" });
    }

    const sanitizedMembers = members.map((member) => ({
      name: String(member.name || '').trim(),
      image: String(member.image || '').trim(),
      roleEn: String(member.roleEn || '').trim(),
      roleTr: String(member.roleTr || '').trim()
    }));

    const sanitizedResponsibilities = responsibilities.map((item) => ({
      en: String(item.en || '').trim(),
      tr: String(item.tr || '').trim()
    }));

    const hasInvalidMember = sanitizedMembers.some((member) => !member.name || !member.image || !member.roleEn || !member.roleTr);
    if (hasInvalidMember) {
      return res.status(400).json({ message: "Each member needs name, image, roleEn, and roleTr" });
    }

    const hasInvalidResponsibility = sanitizedResponsibilities.some((item) => !item.en || !item.tr);
    if (hasInvalidResponsibility) {
      return res.status(400).json({ message: "Each responsibility needs en and tr text" });
    }

    const html = fs.readFileSync(config.filePath, 'utf8');
    const updatedHtml = updateCommitteeHtml(html, config, sanitizedMembers, sanitizedResponsibilities);
    fs.writeFileSync(config.filePath, updatedHtml, 'utf8');

    let i18nContent = fs.readFileSync(I18N_PATH, 'utf8');
    const enUpdates = {};
    const trUpdates = {};

    sanitizedMembers.forEach((member, index) => {
      const key = `${config.i18nPrefix}.team.member${index + 1}.role`;
      enUpdates[key] = member.roleEn;
      trUpdates[key] = member.roleTr;
    });

    sanitizedResponsibilities.forEach((item, index) => {
      const key = `${config.i18nPrefix}.responsibilities.item${index + 1}`;
      enUpdates[key] = item.en;
      trUpdates[key] = item.tr;
    });

    i18nContent = upsertTranslations(i18nContent, 'en', enUpdates);
    i18nContent = upsertTranslations(i18nContent, 'tr', trUpdates);
    fs.writeFileSync(I18N_PATH, i18nContent, 'utf8');

    res.json({ message: "Committee updated", committeeId: config.id });
  } catch (err) {
    console.error("Failed to update committee:", err);
    res.status(500).json({ message: "Failed to update committee", error: err.message });
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

app.post("/api/admin/news", requireAdminPermission('canNews'), async (req, res) => {
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

app.delete("/api/admin/news/:id", requireAdminPermission('canNews'), async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Delete news request - ID: ${id}`);
    console.log(`Query params:`, req.query);
    console.log(`Body:`, req.body);
    
    // Validate MongoDB ObjectId format
    if (!id) {
      return res.status(400).json({ message: "News ID is required" });
    }
    
    // Check if it's a valid MongoDB ObjectId (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error(`Invalid news ID format: ${id}`);
      return res.status(400).json({ message: "Invalid news ID format" });
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

app.post("/api/admin/startups", requireAdminPermission('canStartups'), async (req, res) => {
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

app.delete("/api/admin/startups/:id", requireAdminPermission('canStartups'), async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Delete startup request - ID: ${id}`);
    console.log(`Query params:`, req.query);
    console.log(`Body:`, req.body);
    
    // Validate MongoDB ObjectId format
    if (!id) {
      return res.status(400).json({ message: "Startup ID is required" });
    }
    
    // Check if it's a valid MongoDB ObjectId (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error(`Invalid startup ID format: ${id}`);
      return res.status(400).json({ message: "Invalid startup ID format" });
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
app.post("/api/admin/companies", requireAdminPermission('canTalentPool'), async (req, res) => {
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

app.delete("/api/admin/companies/:id", requireAdminPermission('canTalentPool'), async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Delete company request - ID: ${id}`);
    console.log(`Query params:`, req.query);
    console.log(`Body:`, req.body);
    
    // Validate MongoDB ObjectId format
    if (!id) {
      return res.status(400).json({ message: "Company ID is required" });
    }
    
    // Check if it's a valid MongoDB ObjectId (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error(`Invalid company ID format: ${id}`);
      return res.status(400).json({ message: "Invalid company ID format" });
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

app.get("/api/admin/companies/:companyName/applicants", requireAdminPermission('canTalentPool'), async (req, res) => {
  try {
    const { companyName } = req.params;
    
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

app.post("/api/admin/legacy", requireAdminPermission('canLegacy'), async (req, res) => {
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

app.delete("/api/admin/legacy/:id", requireAdminPermission('canLegacy'), async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Delete legacy member request - ID: ${id}`);
    
    // Validate MongoDB ObjectId format
    if (!id) {
      return res.status(400).json({ message: "Legacy member ID is required" });
    }
    
    // Check if it's a valid MongoDB ObjectId (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error(`Invalid legacy member ID format: ${id}`);
      return res.status(400).json({ message: "Invalid legacy member ID format" });
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

// ------------------- Admin Logging API -------------------
app.post("/api/admin/logs", async (req, res) => {
  try {
    const { adminUsername, actionType, details, sessionId, ipAddress, userAgent, timestamp } = req.body;
    
    // Validate required fields
    if (!adminUsername || !actionType) {
      return res.status(400).json({ message: "adminUsername and actionType are required" });
    }
    
    // Verify admin status (optional check - can be removed if performance is critical)
    // const user = await User.findOne({ username: adminUsername.trim() });
    // if (!user || user.isAdmin !== true) {
    //   return res.status(403).json({ message: "Admin access required" });
    // }
    
    // Get IP address if not provided
    const logIpAddress = ipAddress || 
      req.headers['x-forwarded-for']?.split(',')[0] || 
      req.headers['x-real-ip'] || 
      req.connection?.remoteAddress || 
      req.socket?.remoteAddress ||
      'Unknown';
    
    // Get user agent if not provided
    const logUserAgent = userAgent || req.headers['user-agent'] || 'Unknown';
    
    const adminLog = new AdminLog({
      adminUsername: adminUsername.trim(),
      actionType,
      details: details || {},
      sessionId: sessionId || null,
      ipAddress: logIpAddress.trim(),
      userAgent: logUserAgent,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });
    
    await adminLog.save();
    
    console.log(`📝 Admin Log: ${adminUsername} - ${actionType}${details ? ` - ${JSON.stringify(details).substring(0, 100)}` : ''}`);
    
    res.status(201).json({ message: "Log saved successfully", logId: adminLog._id });
  } catch (err) {
    console.error("❌ Failed to save admin log:", err);
    res.status(500).json({ message: "Failed to save log", error: err.message });
  }
});

// ------------------- Get Admin Logs (for viewing logs - admin only) -------------------
app.get("/api/admin/logs", requireAdminPermission('canLogs'), async (req, res) => {
  try {
    const { actionType, startDate, endDate, limit = 100 } = req.query;
    
    // Verify master admin status (only isMaster: true can view logs)
    if (!req.adminUser || req.adminUser.isMaster !== true) {
      return res.status(403).json({ message: "Master admin access required" });
    }
    
    // Build query
    const query = {};
    if (actionType) query.actionType = actionType;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    const logs = await AdminLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean();
    
    res.json({ logs, count: logs.length });
  } catch (err) {
    console.error("❌ Failed to fetch admin logs:", err);
    res.status(500).json({ message: "Failed to fetch logs", error: err.message });
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



