const express = require('express');
const router = express.Router();
const {
  saveCalculation,
  getCalculations,
  deleteCalculation,
  recalculateHistory,
} = require('../controllers/calcController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All calculation routes require login

router.route('/')
  .post(saveCalculation)
  .get(getCalculations);

router.post('/recalculate', recalculateHistory);
router.delete('/:id', deleteCalculation);

module.exports = router;
