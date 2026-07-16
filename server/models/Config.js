const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  pointsRequired: {
    type: Number,
    required: true,
    min: [0, 'Points required must be at least 0']
  }
});

const configSchema = new mongoose.Schema(
  {
    pointsPerLab: {
      type: Number,
      required: true,
      default: 1,
      min: [0, 'Points per lab must be at least 0']
    },
    pointsPerBadge: {
      type: Number,
      required: true,
      default: 2,
      min: [0, 'Points per badge must be at least 0']
    },
    milestones: {
      type: [milestoneSchema],
      default: [
        { name: 'Bronze Arcade', pointsRequired: 10 },
        { name: 'Silver Arcade', pointsRequired: 25 },
        { name: 'Gold Arcade', pointsRequired: 50 },
        { name: 'Ultimate Arcade Champion', pointsRequired: 80 }
      ]
    },
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'system_config'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Config', configSchema);
