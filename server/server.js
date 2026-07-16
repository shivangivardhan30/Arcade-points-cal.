const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const User = require('./models/User');
const Resource = require('./models/Resource');
const { getOrCreateConfig } = require('./controllers/configController');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Self-bootstrapping data initialization
const initializeData = async () => {
  try {
    // 1. Initialize Points Configuration
    await getOrCreateConfig();
    console.log('System configuration verified/initialized.');

    // 2. Initialize Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@arcade.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';
    
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const emailExists = await User.findOne({ email: adminEmail });
      if (emailExists) {
        console.warn(`Warning: A regular user exists with email ${adminEmail}. Admin auto-create skipped.`);
      } else {
        await User.create({
          name: 'Administrator',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
        });
        console.log(`Default Administrator account created. Email: ${adminEmail}`);
      }
    } else {
      console.log('Administrator account verified.');
    }

    // 3. Initialize Learning Resources
    const resourceCount = await Resource.countDocuments({});
    if (resourceCount === 0) {
      await Resource.create([
        {
          title: "A Tour of Google Cloud Hands-on Labs",
          category: "lab",
          link: "https://www.cloudskillsboost.google/focuses/2794?parent=catalog",
          description: "Learn how to access and navigate the hands-on lab environment in Google Cloud Skills Boost.",
          tags: ["Introduction", "Quickstart"]
        },
        {
          title: "Perform Foundational Infrastructure Tasks in Google Cloud",
          category: "badge",
          link: "https://www.cloudskillsboost.google/quests/118",
          description: "Earn a skill badge by completing labs that guide you through basic cloud administration operations.",
          tags: ["Infrastructure", "Skill Badge"]
        },
        {
          title: "Cloud Engineer Learning Path",
          category: "path",
          link: "https://www.cloudskillsboost.google/paths/11",
          description: "Comprehensive curriculum to build skills needed for Associate Cloud Engineer certification.",
          tags: ["Certification", "Associate"]
        },
        {
          title: "Google Cloud Arcade How-to Guide",
          category: "video",
          link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          description: "Walkthrough of how the point multiplier rules work and how to redeem swag in the Arcade.",
          tags: ["Arcade", "Swag"]
        }
      ]);
      console.log("Default learning resources seeded.");
    }
  } catch (error) {
    console.error('Error during bootstrapping data:', error.message);
  }
};

// Run Bootstrapping
initializeData();

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/config', require('./routes/configRoutes'));
app.use('/api/calculations', require('./routes/calcRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));

// Root endpoint for status checks
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Google Cloud Arcade Points Calculator API is running.' });
});

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
