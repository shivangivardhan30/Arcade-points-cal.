const Calculation = require('../models/Calculation');
const User = require('../models/User');

// @desc    Get leaderboard rankings
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const { search } = req.query;

    // Aggregation pipeline to fetch latest calculation per user
    const pipeline = [
      // Sort calculations by date descending first
      { $sort: { createdAt: -1 } },
      // Group by user, selecting the first calculation (the newest one)
      {
        $group: {
          _id: '$userId',
          latestCalcId: { $first: '$_id' },
          labsCount: { $first: '$labsCount' },
          badgesCount: { $first: '$badgesCount' },
          calculatedPoints: { $first: '$calculatedPoints' },
          milestoneReached: { $first: '$milestoneReached' },
          updatedAt: { $first: '$createdAt' }
        }
      },
      // Join user accounts to get names
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      // Project final fields
      {
        $project: {
          userId: '$_id',
          name: '$user.name',
          role: '$user.role',
          labsCount: 1,
          badgesCount: 1,
          calculatedPoints: 1,
          milestoneReached: 1,
          updatedAt: 1
        }
      },
      // Sort by points descending
      { $sort: { calculatedPoints: -1 } }
    ];

    let rankings = await Calculation.aggregate(pipeline);

    // Apply search filter if present (case-insensitive name match)
    if (search) {
      const searchLower = search.toLowerCase();
      rankings = rankings.filter(r => r.name.toLowerCase().includes(searchLower));
    }

    res.json(rankings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLeaderboard
};
