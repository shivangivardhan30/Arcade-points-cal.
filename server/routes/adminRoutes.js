const express = require('express');
const router = express.Router();
const {
  getActiveAnnouncements,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAllUsers,
  deleteUser,
  getSystemStats,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Active announcements is visible to any logged in user on their dashboard
router.get('/announcements/active', protect, getActiveAnnouncements);

// Rest of the routes are admin only
router.use(protect, adminOnly);

router.route('/announcements')
  .get(getAllAnnouncements)
  .post(createAnnouncement);

router.route('/announcements/:id')
  .put(updateAnnouncement)
  .delete(deleteAnnouncement);

router.route('/users')
  .get(getAllUsers);

router.route('/users/:id')
  .delete(deleteUser);

router.get('/stats', getSystemStats);

module.exports = router;
