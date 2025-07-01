const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");
const qs = require("querystring");
require("dotenv").config();

// Express initialization
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pd2planner", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

mongoose.set("strictQuery", true);

// Models
const userSchema = new mongoose.Schema({
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

const User = mongoose.model("User", userSchema);

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

const CraftItem = mongoose.model("CraftItem", CraftItemSchema);

const CharacterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
    match: /^[A-Za-z]{2,13}$/,
  },
  shareCode: {
    type: String,
  },
  state: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// CharacterSchema.statics.findByShareCode = async function (name, shareCode) {
//   return this.findOne({ name, shareCode });
// };

// Create the model
const Character = mongoose.model("Character", CharacterSchema);

// Achievement configuration
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

// Middleware
function auth(req, res, next) {
  try {
    // Check if Authorization header exists
    if (!req.headers.authorization) {
      console.error("No authorization header found");
      return res
        .status(401)
        .json({ error: "Authentication failed - no token provided" });
    }

    // Extract token
    const authParts = req.headers.authorization.split(" ");
    if (authParts.length !== 2 || authParts[0] !== "Bearer") {
      console.error("Invalid authorization format");
      return res
        .status(401)
        .json({ error: "Authentication failed - invalid token format" });
    }

    const token = authParts[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Make sure userId exists in decoded token
    if (!decoded.userId) {
      console.error("Token missing userId:", decoded);
      return res
        .status(401)
        .json({ error: "Authentication failed - invalid token content" });
    }

    // Set user data
    req.userData = {
      userId: decoded.userId,
      username: decoded.username || "unknown",
    };

    console.log("Auth successful for user:", req.userData.userId);
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res
      .status(401)
      .json({ error: "Authentication failed - " + error.message });
  }
}

// Authentication Routes
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

// Discord OAuth Routes
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

// User Routes
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find(
      { discordId: { $exists: true } },
      {
        username: 1,
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

// Achievement Routes
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

// Custom Craft Items Routes
app.get("/api/custom-crafts", auth, async (req, res) => {
  try {
    const items = await CraftItem.find({ userId: req.userData.userId });
    res.json({ success: true, items });
  } catch (error) {
    console.error("Error fetching custom craft items:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

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

app.post("/api/custom-crafts", auth, async (req, res) => {
  try {
    // Make sure userId is correctly extracted from req.userData
    if (!req.userData || !req.userData.userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated properly",
      });
    }

    const userId = req.userData.userId;
    console.log("Creating item for user:", userId);

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

    // Validate each affix with improved validation
    const isValidAffix = affixes.every((affix) => {
      // Each affix must have a type
      if (!affix.type || !["base", "prefix", "suffix"].includes(affix.type)) {
        console.log("Invalid affix type:", affix);
        return false;
      }

      // Each affix must have either a name or a stat (or both)
      if (!affix.name && !affix.stat) {
        console.log("Missing name and stat:", affix);
        return false;
      }

      // Each affix must have a numeric value
      if (typeof affix.value !== "number") {
        console.log("Invalid value type:", affix);
        return false;
      }

      return true;
    });

    if (!isValidAffix) {
      return res.status(400).json({
        success: false,
        message: "Invalid affix structure",
      });
    }

    // Create new craft item with the correct userId
    const newCraftItem = new CraftItem({
      userId: userId, // Explicitly use the extracted userId
      itemName,
      itemType,
      baseType,
      craftType,
      affixes,
    });

    // Log the item being created for debugging
    console.log("Creating craft item:", {
      userId,
      itemName,
      itemType,
      baseType,
      craftType,
      affixCount: affixes.length,
    });

    // Save to database
    await newCraftItem.save();

    // Respond with success and the created item
    res.status(201).json({
      success: true,
      item: {
        _id: newCraftItem._id,
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

app.get("/api/characters", auth, async (req, res) => {
  try {
    console.log("Fetching characters for user:", req.userData.userId);

    const characters = await Character.find({ userId: req.userData.userId })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(10); // Limit to 10 save slots

    res.json({ success: true, characters });
  } catch (error) {
    console.error("Error fetching characters:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET a specific character
app.get("/api/characters/:id", auth, async (req, res) => {
  try {
    const character = await Character.findOne({
      _id: req.params.id,
      userId: req.userData.userId,
    });

    if (!character) {
      return res
        .status(404)
        .json({ success: false, message: "Character not found" });
    }

    res.json({ success: true, character });
  } catch (error) {
    console.error("Error fetching character:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST a new character
app.post("/api/characters", auth, async (req, res) => {
  try {
    console.log("Saving character for user:", req.userData.userId);
    console.log(
      "Character data:",
      JSON.stringify(req.body).substring(0, 100) + "..."
    );

    // Validate character name - letters only, 2-13 characters
    const nameRegex = /^[A-Za-z]{2,13}$/;
    if (!req.body.name || !nameRegex.test(req.body.name)) {
      return res.status(400).json({
        success: false,
        message:
          "Character name must be 2-13 letters only. No numbers, spaces, or special characters.",
      });
    }

    // Check if the user already has 10 characters
    const characterCount = await Character.countDocuments({
      userId: req.userData.userId,
    });
    if (characterCount >= 10) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum character limit reached (10). Please delete a character before saving a new one.",
      });
    }

    const newCharacter = new Character({
      userId: req.userData.userId,
      name: req.body.name,
      state: req.body.state,
      createdAt: req.body.createdAt || new Date(),
    });

    await newCharacter.save();
    res.json({ success: true, character: newCharacter });
  } catch (error) {
    console.error("Error saving character:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
});

// DELETE a character
app.delete("/api/characters/:id", auth, async (req, res) => {
  try {
    const character = await Character.findOne({
      _id: req.params.id,
      userId: req.userData.userId,
    });

    if (!character) {
      return res
        .status(404)
        .json({ success: false, message: "Character not found" });
    }

    await Character.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: "Character deleted successfully" });
  } catch (error) {
    console.error("Error deleting character:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/shared-character/:name/:shareCode", async (req, res) => {
  try {
    const { name, shareCode } = req.params;

    // Find the character by name and share code
    const character = await Character.findOne({
      name: name,
      shareCode: shareCode,
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: "Character not found",
      });
    }

    // Return the character without sensitive information
    res.json({
      success: true,
      character: {
        name: character.name,
        shareCode: character.shareCode,
        state: character.state,
        createdAt: character.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching shared character:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Add route to handle share URLs in the frontend
app.get("/:nameWithCode", (req, res) => {
  // This route will be handled by your frontend to load shared characters
  // Just serve your main HTML file, and let the frontend handle the parsing
  res.sendFile(path.join(__dirname, "index.html"));
});

app.put("/api/characters/:id", auth, async (req, res) => {
  try {
    // Find the character by ID and user ID
    const character = await Character.findOne({
      _id: req.params.id,
      userId: req.userData.userId,
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: "Character not found or not owned by current user",
      });
    }

    // Update only the fields that are provided
    if (req.body.name) character.name = req.body.name;
    if (req.body.shareCode) character.shareCode = req.body.shareCode;
    if (req.body.state) character.state = req.body.state;

    // Save the updated character
    await character.save();

    // Return the updated character
    res.json({
      success: true,
      message: "Character updated successfully",
      character: character,
    });
  } catch (error) {
    console.error("Error updating character:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
