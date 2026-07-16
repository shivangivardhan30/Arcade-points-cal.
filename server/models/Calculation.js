const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    labsCount: {
      type: Number,
      required: true,
      min: [0, 'Completed labs cannot be negative'],
    },
    badgesCount: {
      type: Number,
      required: true,
      min: [0, 'Completed badges cannot be negative'],
    },
    calculatedPoints: {
      type: Number,
      required: true,
    },
    milestoneReached: {
      type: String,
      default: 'None',
    },
    pointsConfig: {
      pointsPerLab: {
        type: Number,
        required: true,
      },
      pointsPerBadge: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Calculation', calculationSchema);
