const express = require('express');
const router = express.Router();
const { getResources, createResource, deleteResource } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.route('/')
  .get(getResources)
  .post(protect, adminOnly, createResource);

router.route('/:id')
  .delete(protect, adminOnly, deleteResource);

module.exports = router;
