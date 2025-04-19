const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");
const qs = require("querystring");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Discord callback route
app.get("/auth/discord/callback", async (req, res) => {
  const code = req.query.code;
  console.log("Auth code:", code);

  try {
    // Get Discord token
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      qs.stringify({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get Discord user data
    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const discordUser = userResponse.data;
    console.log("Discord user data:", {
      id: discordUser.id,
      username: discordUser.username,
      avatar: discordUser.avatar,
    });

    // Get avatar URL
    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=32`
      : `https://cdn.discordapp.com/embed/avatars/${
          parseInt(discordUser.id) % 5
        }.png`;

    console.log("Avatar URL:", avatarUrl);

    let user = await User.findOne({ discordId: discordUser.id });

    if (!user) {
      user = new User({
        username: discordUser.username,
        discordId: discordUser.id,
        avatarUrl: avatarUrl,
      });
    } else {
      user.avatarUrl = avatarUrl;
    }
    await user.save();
    console.log("Saved user with avatar:", user.avatarUrl);

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Redirect to frontend with token
    res.redirect("https://pd2planner.net/");
  } catch (error) {
    console.error("Auth error:", error.response?.data || error.message);
    res.redirect("https://pd2planner.net/auth-error.html");
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find(
      { discordId: { $exists: true } },
      {
        username: 1,
        // discordUsername: 1,
        // createdAt: 1,
        avatarUrl: 1,
      }
    );
    console.log("Sending users data:", users);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// User model
const User = mongoose.model("User", {
  email: { type: String, sparse: true }, // Make sparse to allow null
  username: { type: String, required: true },
  discordId: { type: String, unique: true }, // Add this
  discordUsername: String,
  avatarUrl: String,
  password: { type: String, sparse: true }, // Make sparse to allow null for Discord users
  createdAt: { type: Date, default: Date.now },
  achievements: [
    {
      name: String,
      unlockedAt: Date,
    },
  ],
  settings: {
    theme: { type: String, default: "light" },
    notifications: { type: Boolean, default: true },
  },
});

// Auth middleware
function auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed" });
  }
}

const achievementValidators = {
  "flying-start": (values) => values[0] === 99,
  "max-stats": (values) => {
    const value = Number(values[0]);
    console.log("Validating max-stats:", value);
    return value >= 400; // Changed to 400
  },
  "perfect-res": (values) => {
    const [fireRes, coldRes, lightRes, poisonRes] = values;
    return fireRes >= 75 && coldRes >= 75 && lightRes >= 75 && poisonRes >= 75;
  },
  "charm-master": (values) => values[0] >= 20,
};

const achievementNames = {
  "flying-start": "Off to a flying start",
  "max-stats": "Peak performance",
  "perfect-res": "Elemental master",
  "charm-master": "Charm collector",
};

// Achievement route - placing it before other routes
app.post("/achievement/:id", auth, async (req, res) => {
  try {
    const achievementId = req.params.id;
    const { value, values } = req.body;

    // Debug logging
    console.log("Achievement request:", {
      achievementId,
      value,
      values,
      body: req.body,
    });

    // Convert single value to array format for consistency
    const valuesArray = values || [value];

    // Debug logging
    console.log("Checking validator:", {
      achievementId,
      hasValidator: achievementValidators.hasOwnProperty(achievementId),
      validators: Object.keys(achievementValidators),
    });

    // Check if this is a valid achievement type
    if (!achievementValidators[achievementId]) {
      console.log("Invalid achievement type:", achievementId);
      return res.status(400).json({ error: "Invalid achievement type" });
    }

    // Debug validation
    console.log("Validating achievement:", {
      achievementId,
      values: valuesArray,
      result: achievementValidators[achievementId](valuesArray),
    });

    // Validate the achievement conditions
    if (!achievementValidators[achievementId](valuesArray)) {
      return res.json({ message: "Keep trying!" });
    }

    const user = await User.findById(req.userData.userId);

    // Check if user already has this achievement
    const hasAchievement = user.achievements.some(
      (a) => a.name === achievementNames[achievementId]
    );

    if (!hasAchievement) {
      user.achievements.push({
        name: achievementNames[achievementId],
        unlockedAt: new Date(),
      });
      await user.save();
      res.json({ message: "Achievement unlocked!" });
    } else {
      res.json({ message: "" });
    }
  } catch (error) {
    console.error("Achievement error:", error);
    res.status(500).json({ error: "Failed to process achievement" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: login }, { username: login }],
    });

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Profile route
app.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userData.userId);
    res.json({
      username: user.username,
      createdAt: user.createdAt,
      achievements: user.achievements,
      settings: user.settings,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Settings route
app.put("/profile/settings", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userData.userId,
      { settings: req.body },
      { new: true }
    );
    res.json({ settings: user.settings });
  } catch (error) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Email or username already exists",
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      username,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// =====================================================================
// CUSTOM CRAFT ITEMS FUNCTIONALITY - START
// =====================================================================

// Create Schema for custom craft items
const CraftItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  itemName: {
    type: String,
    required: true,
  },
  itemType: {
    type: String,
    required: true,
    enum: ["weapon", "armor", "helm", "shield"],
  },
  baseType: {
    type: String,
    required: true,
  },
  craftType: {
    type: String,
    required: true,
  },
  affixes: [
    {
      name: { type: String },
      type: { type: String },
      stat: { type: String },
      value: { type: Number },
      min: { type: Number },
      max: { type: Number },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create CraftItem model
const CraftItem = mongoose.model("CraftItem", CraftItemSchema);

// Verify token endpoint for craft items
app.get("/verify-token", (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Return user data
    res.json({
      valid: true,
      userId: decoded.userId,
      username: decoded.username,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.json({ valid: false });
  }
});

// GET all custom craft items for the logged-in user
app.get("/api/custom-crafts", auth, async (req, res) => {
  try {
    const items = await CraftItem.find({ userId: req.userData.userId });
    res.json({ success: true, items });
  } catch (error) {
    console.error("Error fetching custom craft items:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET a specific custom craft item by ID
app.get("/api/custom-crafts/:id", auth, async (req, res) => {
  try {
    const item = await CraftItem.findOne({
      _id: req.params.id,
      userId: req.userData.userId,
    });

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, item });
  } catch (error) {
    console.error("Error fetching custom craft item:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST create a new custom craft item
app.post("/api/custom-crafts", auth, async (req, res) => {
  try {
    // Extract username from authenticated request
    const { username } = req.userData;

    // Validate incoming request body
    const { itemName, itemType, baseType, craftType, affixes } = req.body;

    // Comprehensive input validation
    if (!itemName || typeof itemName !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing item name",
      });
    }

    // Validate item type against allowed types
    const validItemTypes = ["weapon", "armor", "helm", "shield"];
    if (!validItemTypes.includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item type",
      });
    }

    // Validate craft type
    const validCraftTypes = [
      "Blood",
      "Caster",
      "Hitpower",
      "Safety",
      "Vampiric",
      "Bountiful",
      "Brilliant",
    ];
    if (!validCraftTypes.includes(craftType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid craft type",
      });
    }

    // Validate affixes
    if (!Array.isArray(affixes) || affixes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Affixes must be a non-empty array",
      });
    }

    // Count prefixes and suffixes
    const prefixCount = affixes.filter(
      (affix) => affix.type === "prefix"
    ).length;
    const suffixCount = affixes.filter(
      (affix) => affix.type === "suffix"
    ).length;

    // Validate prefix and suffix counts
    if (prefixCount > 3 || suffixCount > 3) {
      return res.status(400).json({
        success: false,
        message: "Maximum of 3 prefixes and 3 suffixes allowed",
      });
    }

    // Validate each affix
    const isValidAffix = affixes.every(
      (affix) =>
        affix.name &&
        affix.type &&
        (affix.type === "base" ||
          affix.type === "prefix" ||
          affix.type === "suffix") &&
        affix.stat &&
        typeof affix.value === "number"
    );

    if (!isValidAffix) {
      return res.status(400).json({
        success: false,
        message: "Invalid affix structure",
      });
    }

    // Create new craft item
    const newCraftItem = new CraftItem({
      username,
      itemName,
      itemType,
      baseType,
      craftType,
      affixes,
    });

    // Save to database
    await newCraftItem.save();

    // Log the created item for server-side tracking
    console.log("Custom craft item created:", {
      id: newCraftItem._id,
      username: newCraftItem.username,
      itemName: newCraftItem.itemName,
      itemType: newCraftItem.itemType,
    });

    // Respond with success and the created item
    res.status(201).json({
      success: true,
      item: {
        _id: newCraftItem._id,
        username: newCraftItem.username,
        itemName: newCraftItem.itemName,
        itemType: newCraftItem.itemType,
        baseType: newCraftItem.baseType,
        craftType: newCraftItem.craftType,
        affixes: newCraftItem.affixes,
      },
    });
  } catch (error) {
    // Detailed error logging
    console.error("Error creating custom craft item:", {
      message: error.message,
      stack: error.stack,
      body: req.body,
    });

    // Differentiate between validation and server errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // Generic server error for unexpected issues
    res.status(500).json({
      success: false,
      message: "Failed to create custom craft item",
      error: error.message,
    });
  }
});

// PUT update a custom craft item
app.put("/api/custom-crafts/:id", auth, async (req, res) => {
  try {
    const { itemName, itemType, baseType, craftType, affixes } = req.body;

    // Find and update the item
    const updatedItem = await CraftItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.userData.userId },
      { itemName, itemType, baseType, craftType, affixes },
      { new: true }
    );

    if (!updatedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found or unauthorized" });
    }

    res.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error("Error updating custom craft item:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE a custom craft item
app.delete("/api/custom-crafts/:id", auth, async (req, res) => {
  try {
    const result = await CraftItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.userData.userId,
    });

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found or unauthorized" });
    }

    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting custom craft item:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// =====================================================================
// CUSTOM CRAFT ITEMS FUNCTIONALITY - END
// =====================================================================

const loginEvent = new CustomEvent("userLoggedIn", {
  detail: {
    userId: user._id,
    username: user.username,
  },
});
document.dispatchEvent(loginEvent);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
