const Calculation = require('../models/Calculation');
const Config = require('../models/Config');

// Helper to determine milestone reached based on points and milestones array
const calculateMilestone = (points, milestones) => {
  if (!milestones || milestones.length === 0) return 'None';
  
  // Sort milestones by points required ascending
  const sortedMilestones = [...milestones].sort((a, b) => a.pointsRequired - b.pointsRequired);
  
  let milestone = 'None';
  for (let i = 0; i < sortedMilestones.length; i++) {
    if (points >= sortedMilestones[i].pointsRequired) {
      milestone = sortedMilestones[i].name;
    }
  }
  return milestone;
};

// @desc    Save a new calculation
// @route   POST /api/calculations
// @access  Private
const saveCalculation = async (req, res) => {
  try {
    const { labsCount, badgesCount } = req.body;

    if (labsCount === undefined || badgesCount === undefined) {
      return res.status(400).json({ message: 'Please provide labs and badges count' });
    }

    if (labsCount < 0 || badgesCount < 0) {
      return res.status(400).json({ message: 'Counts cannot be negative' });
    }

    // Get current config
    const config = await Config.findOne({ key: 'system_config' });
    const pointsPerLab = config ? config.pointsPerLab : 1;
    const pointsPerBadge = config ? config.pointsPerBadge : 2;
    const milestones = config ? config.milestones : [];

    // Calculate points
    const calculatedPoints = (labsCount * pointsPerLab) + (badgesCount * pointsPerBadge);

    // Get milestone reached
    const milestoneReached = calculateMilestone(calculatedPoints, milestones);

    // Create calculation
    const calculation = await Calculation.create({
      userId: req.user.id,
      labsCount,
      badgesCount,
      calculatedPoints,
      milestoneReached,
      pointsConfig: {
        pointsPerLab,
        pointsPerBadge,
      },
    });

    res.status(201).json(calculation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's calculation history
// @route   GET /api/calculations
// @access  Private
const getCalculations = async (req, res) => {
  try {
    const calculations = await Calculation.find({ userId: req.user.id })
      .sort({ createdAt: -1 }); // Newest first

    res.json(calculations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a calculation from history
// @route   DELETE /api/calculations/:id
// @access  Private
const deleteCalculation = async (req, res) => {
  try {
    const calculation = await Calculation.findById(req.params.id);

    if (!calculation) {
      return res.status(404).json({ message: 'Calculation not found' });
    }

    // Check user ownership (allow admin to delete too)
    if (calculation.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized to delete this record' });
    }

    await calculation.deleteOne();
    res.json({ message: 'Calculation removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Recalculate entire history with current point values and milestones
// @route   POST /api/calculations/recalculate
// @access  Private
const recalculateHistory = async (req, res) => {
  try {
    // Get current config
    const config = await Config.findOne({ key: 'system_config' });
    const pointsPerLab = config ? config.pointsPerLab : 1;
    const pointsPerBadge = config ? config.pointsPerBadge : 2;
    const milestones = config ? config.milestones : [];

    // Find all calculations for user
    const calculations = await Calculation.find({ userId: req.user.id });

    if (calculations.length === 0) {
      return res.json({ message: 'No calculations to update', count: 0 });
    }

    // Process each calculation
    const updatePromises = calculations.map(async (calc) => {
      const newPoints = (calc.labsCount * pointsPerLab) + (calc.badgesCount * pointsPerBadge);
      const newMilestone = calculateMilestone(newPoints, milestones);

      calc.calculatedPoints = newPoints;
      calc.milestoneReached = newMilestone;
      calc.pointsConfig = {
        pointsPerLab,
        pointsPerBadge,
      };

      return calc.save();
    });

    await Promise.all(updatePromises);

    // Return the updated list
    const updatedCalculations = await Calculation.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({
      message: 'Recalculation complete',
      count: updatedCalculations.length,
      data: updatedCalculations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveCalculation,
  getCalculations,
  deleteCalculation,
  recalculateHistory,
};
