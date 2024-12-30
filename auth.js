const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/auth_demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});


function validatePassword(password) {
  return password.length >= 10 && /\d/.test(password);
}

// Update your signup endpoint
app.post('/signup', async (req, res) => {
  try {
      const { email, username, password } = req.body;

      // Validate password
      if (!validatePassword(password)) {
          return res.status(400).json({ 
              error: 'Password must be at least 10 characters long and contain at least one number' 
          });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = new User({
          email,
          username,
          password: hashedPassword
      });
      
      await user.save();
      res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
      res.status(400).json({ error: 'Username or email already exists' });
  }
});

// Updated User model with both email and username
const User = mongoose.model('User', {
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  achievements: [{
      name: String,
      unlockedAt: Date
  }],
  settings: {
      theme: { type: String, default: 'light' },
      notifications: { type: Boolean, default: true }
      // Add more settings as needed
  }
});

// Add these new routes
app.get('/profile', auth, async (req, res) => {
  try {
      const user = await User.findById(req.userData.userId);
      res.json({
          username: user.username,
          createdAt: user.createdAt,
          achievements: user.achievements,
          settings: user.settings
      });
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/profile/settings', auth, async (req, res) => {
  try {
      const user = await User.findByIdAndUpdate(
          req.userData.userId,
          { settings: req.body },
          { new: true }
      );
      res.json({ settings: user.settings });
  } catch (error) {
      res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      email,
      username,
      password: hashedPassword
    });
    
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Username or email already exists' });
  }
});

// Login endpoint (can login with either email or username)
app.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body; // login can be email or username
    const user = await User.findOne({
      $or: [
        { email: login },
        { username: login }
      ]
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username // Include username in token
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token,
      username: user.username // Return username for display
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get user profile (protected route)
app.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userData.userId);
    res.json({ 
      username: user.username,
      // email not included in response for privacy
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

function auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}

app.listen(3000, () => console.log('Server running on port 3000'));