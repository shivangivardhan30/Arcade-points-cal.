const express = require('express');
const router = express.Router();
const { scrapeProfile } = require('../controllers/profileController');

router.post('/scrape', scrapeProfile);

module.exports = router;
