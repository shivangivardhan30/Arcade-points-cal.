const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderboardController');

// Leaderboard rankings are publicly viewable
router.get('/', getLeaderboard);

module.exports = router;
