const Config = require('../models/Config');

// Helper to seed defaults if config does not exist
const getOrCreateConfig = async () => {
  let config = await Config.findOne({ key: 'system_config' });
  if (!config) {
    config = await Config.create({
      key: 'system_config',
      pointsPerLab: 1,
      pointsPerBadge: 2,
      milestones: [
        { name: 'Bronze Arcade', pointsRequired: 10 },
        { name: 'Silver Arcade', pointsRequired: 25 },
        { name: 'Gold Arcade', pointsRequired: 50 },
        { name: 'Ultimate Arcade Champion', pointsRequired: 80 }
      ]
    });
  }
  return config;
};

// @desc    Get current points configuration
// @route   GET /api/config
// @access  Private
const getConfig = async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update points configuration
// @route   PUT /api/config
// @access  Private/Admin
const updateConfig = async (req, res) => {
  try {
    const { pointsPerLab, pointsPerBadge, milestones } = req.body;

    let config = await Config.findOne({ key: 'system_config' });
    if (!config) {
      config = new Config({ key: 'system_config' });
    }

    if (pointsPerLab !== undefined) config.pointsPerLab = pointsPerLab;
    if (pointsPerBadge !== undefined) config.pointsPerBadge = pointsPerBadge;
    if (milestones !== undefined) config.milestones = milestones;

    await config.save();
    res.json(config);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getConfig,
  updateConfig,
  getOrCreateConfig,
};
