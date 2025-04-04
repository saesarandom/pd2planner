const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios"); // Move this to the top
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

app.post("/achievement/:id", auth, async (req, res) => {
  try {
    const achievementId = req.params.id;
    const { value, values } = req.body;

    // Convert single value to array format for consistency
    const valuesArray = values || [value];

    // Check if this is a valid achievement type
    if (!achievementValidators[achievementId]) {
      return res.status(400).json({ error: "Invalid achievement type" });
    }

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
      // Silently acknowledge without message for already unlocked achievements
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
