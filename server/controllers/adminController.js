const User = require('../models/User');
const Announcement = require('../models/Announcement');
const Calculation = require('../models/Calculation');

// ==========================================
// ANNOUNCEMENT CONTROLLERS
// ==========================================

// @desc    Get active announcements (for users dashboard)
// @route   GET /api/admin/announcements/active
// @access  Private
const getActiveAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ active: true }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all announcements (for admin panel)
// @route   GET /api/admin/announcements
// @access  Private/Admin
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an announcement
// @route   POST /api/admin/announcements
// @access  Private/Admin
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, active } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const announcement = await Announcement.create({
      title,
      content,
      active: active !== undefined ? active : true,
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an announcement (toggle active or edit)
// @route   PUT /api/admin/announcements/:id
// @access  Private/Admin
const updateAnnouncement = async (req, res) => {
  try {
    const { title, content, active } = req.body;
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (title !== undefined) announcement.title = title;
    if (content !== undefined) announcement.content = content;
    if (active !== undefined) announcement.active = active;

    await announcement.save();
    res.json(announcement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/admin/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await announcement.deleteOne();
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// USER MANAGEMENT CONTROLLERS
// ==========================================

// @desc    Get all users (excluding passwords)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user and their calculation history
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    // Delete calculations
    await Calculation.deleteMany({ userId: user._id });

    // Delete user
    await user.deleteOne();

    res.json({ message: 'User and their calculation history have been deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get system stats dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCalculations = await Calculation.countDocuments({});
    
    // Average points
    const calculations = await Calculation.find({});
    const totalPoints = calculations.reduce((sum, item) => sum + item.calculatedPoints, 0);
    const averagePoints = totalCalculations > 0 ? Math.round((totalPoints / totalCalculations) * 10) / 10 : 0;

    const activeAnnouncements = await Announcement.countDocuments({ active: true });

    res.json({
      totalUsers,
      totalCalculations,
      averagePoints,
      activeAnnouncements,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getActiveAnnouncements,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAllUsers,
  deleteUser,
  getSystemStats,
};
