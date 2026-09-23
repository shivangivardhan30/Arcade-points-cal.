import { POINT_RULES } from '../config/pointsRules';
import { TIERS } from '../config/tiers';
import { FACILITATOR_MILESTONES } from '../config/facilitatorRules';

/**
 * Calculates complete Arcade progress metrics from parsed profile data
 * @param {Object} profile 
 * @returns {Object} Calculated metrics
 */
export const calculateArcadeMetrics = (profile) => {
  if (!profile) return null;

  const gameBadgesCount = parseInt(profile.gameBadgesCount) || 0;
  const skillBadgesCount = parseInt(profile.skillBadgesCount || profile.badgesCount) || 0;
  const triviaBadgesCount = parseInt(profile.triviaBadgesCount) || 0;
  const questsCount = parseInt(profile.labsCount) || 0;

  // 1. Calculate points from categories
  const gamePoints = gameBadgesCount * POINT_RULES.gameBadge;
  const skillPoints = skillBadgesCount * POINT_RULES.skillBadge;
  const triviaPoints = triviaBadgesCount * POINT_RULES.triviaBadge;
  const questPoints = questsCount * POINT_RULES.quest;

  // 2. Evaluate Facilitator Milestones
  let earnedFacilitatorBonus = 0;
  let highestCompletedMilestone = null;

  const milestoneResults = FACILITATOR_MILESTONES.map((m) => {
    const isCompleted =
      skillBadgesCount >= m.skillBadgesNeeded &&
      gameBadgesCount >= m.gamesNeeded &&
      triviaBadgesCount >= m.triviaNeeded;

    if (isCompleted) {
      if (m.bonusPoints > earnedFacilitatorBonus) {
        earnedFacilitatorBonus = m.bonusPoints;
        highestCompletedMilestone = m;
      }
    }

    return {
      ...m,
      isCompleted
    };
  });

  const nextFacilitatorMilestone = milestoneResults.find(m => !m.isCompleted) || null;
  const maxFacilitatorBonus = FACILITATOR_MILESTONES[FACILITATOR_MILESTONES.length - 1].bonusPoints;
  const remainingFacilitatorBonus = Math.max(0, maxFacilitatorBonus - earnedFacilitatorBonus);

  // 3. Total Points
  const totalPoints = gamePoints + skillPoints + triviaPoints + questPoints + earnedFacilitatorBonus;

  // 4. Calculate Current Tier & Next Tier
  const sortedTiers = [...TIERS].sort((a, b) => a.minPoints - b.minPoints);

  let currentTier = sortedTiers[0];
  for (let i = 0; i < sortedTiers.length; i++) {
    if (totalPoints >= sortedTiers[i].minPoints) {
      currentTier = sortedTiers[i];
    }
  }

  const nextTierIndex = sortedTiers.findIndex(t => t.id === currentTier.id) + 1;
  const nextTier = nextTierIndex < sortedTiers.length ? sortedTiers[nextTierIndex] : null;

  let progressPercent = 100;
  let pointsNeeded = 0;

  if (nextTier) {
    const range = nextTier.minPoints - currentTier.minPoints;
    const progress = totalPoints - currentTier.minPoints;
    progressPercent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
    pointsNeeded = nextTier.minPoints - totalPoints;
  }

  // 5. Generate Data-Driven Next Actions
  const nextActions = [];

  if (nextTier) {
    nextActions.push({
      title: `Reach ${nextTier.name} Tier`,
      description: `Earn ${pointsNeeded} more point${pointsNeeded > 1 ? 's' : ''} to unlock the ${nextTier.name} milestone.`,
      type: 'tier'
    });
  } else {
    nextActions.push({
      title: 'Maintain Legend Standing',
      description: 'You have reached the highest configured tier! Continue completing new Arcade challenges.',
      type: 'tier'
    });
  }

  if (nextFacilitatorMilestone) {
    const missingSkills = Math.max(0, nextFacilitatorMilestone.skillBadgesNeeded - skillBadgesCount);
    const missingGames = Math.max(0, nextFacilitatorMilestone.gamesNeeded - gameBadgesCount);
    const missingTrivia = Math.max(0, nextFacilitatorMilestone.triviaNeeded - triviaBadgesCount);

    const details = [];
    if (missingSkills > 0) details.push(`${missingSkills} Skill Badge${missingSkills > 1 ? 's' : ''}`);
    if (missingGames > 0) details.push(`${missingGames} Game Badge${missingGames > 1 ? 's' : ''}`);
    if (missingTrivia > 0) details.push(`${missingTrivia} Trivia Badge${missingTrivia > 1 ? 's' : ''}`);

    nextActions.push({
      title: `Complete Facilitator ${nextFacilitatorMilestone.name}`,
      description: `Complete ${details.join(', ')} to earn +${nextFacilitatorMilestone.bonusPoints} bonus points.`,
      type: 'facilitator'
    });
  }

  if (gameBadgesCount === 0) {
    nextActions.push({
      title: 'Earn an Arcade Game Badge',
      description: `Complete 1 active Arcade Game or Level badge to add +${POINT_RULES.gameBadge} point to your score.`,
      type: 'game'
    });
  } else {
    nextActions.push({
      title: 'Earn Additional Skill Badges',
      description: `Each completed Skill Badge contributes +${POINT_RULES.skillBadge} point to your Arcade progress.`,
      type: 'skill'
    });
  }

  // 6. Timeline Generation
  const timelineItems = [];

  if (profile.badges && profile.badges.length > 0) {
    profile.badges.forEach((b, idx) => {
      if (b.earned !== false) {
        timelineItems.push({
          id: idx + 1,
          title: b.title,
          category: b.category || b.type || 'Badge',
          status: 'Completed',
          type: 'badge'
        });
      }
    });
  }

  milestoneResults.forEach(m => {
    if (m.isCompleted) {
      timelineItems.push({
        id: `m-${m.id}`,
        title: `Facilitator ${m.name} Milestone Unlocked`,
        category: 'Milestone Bonus',
        status: `+${m.bonusPoints} Bonus Pts`,
        type: 'milestone'
      });
    }
  });

  return {
    profileName: profile.name || 'Google Cloud Learner',
    avatar: profile.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    memberSince: profile.memberSince || 'Google Cloud Learner',
    profileUrl: profile.profileUrl || '',
    
    // Counts
    gameBadgesCount,
    skillBadgesCount,
    triviaBadgesCount,
    questsCount,
    
    // Calculated Points
    gamePoints,
    skillPoints,
    triviaPoints,
    questPoints,
    earnedFacilitatorBonus,
    remainingFacilitatorBonus,
    totalPoints,

    // Tiers
    currentTier,
    nextTier,
    progressPercent,
    pointsNeeded,

    // Facilitator
    milestoneResults,
    nextFacilitatorMilestone,

    // Recommendations & Timeline
    nextActions,
    timelineItems,

    // Raw badges list
    badges: profile.badges || []
  };
};
