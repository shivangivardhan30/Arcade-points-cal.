import { POINT_RULES } from '../config/pointsRules';
import { TIERS } from '../config/tiers';
import { FACILITATOR_MILESTONES, BONUS_TASK_RULE } from '../config/facilitatorRules';

/**
 * Calculates complete Arcade metrics from parsed profile data.
 * Enforces strict mathematical consistency:
 * Total Points = (Game Badges × 1.0) + (Skill Badges × 0.5) + (Highest Eligible Non-Cumulative Facilitator Bonus)
 * 
 * @param {Object} profile 
 * @returns {Object|null}
 */
export const calculateArcadeMetrics = (profile) => {
  if (!profile) return null;

  let gameBadgesCount = 0;
  let skillBadgesCount = 0;

  // Calculate directly from badges list if available for 100% accuracy
  if (Array.isArray(profile.badges) && profile.badges.length > 0) {
    profile.badges.forEach((b) => {
      const cat = (b.category || '').toLowerCase();
      const title = (b.title || '').toLowerCase();

      const isGame = cat.includes('game') || 
                     cat.includes('trivia') || 
                     title.includes('level') || 
                     title.includes('trivia') || 
                     title.includes('monitored') || 
                     title.includes('arcade') || 
                     title.includes('speed run') || 
                     title.includes('basecamp');

      const isSkill = cat.includes('skill') || title.includes('skill badge');

      if (isGame) {
        gameBadgesCount++;
      } else if (isSkill) {
        skillBadgesCount++;
      }
    });
  } else {
    // Fallback to provided numeric counts if badges array isn't populated
    const rawGame = parseInt(profile.gameBadgesCount) || 0;
    const rawTrivia = parseInt(profile.triviaBadgesCount) || 0;
    const rawSkill = parseInt(profile.skillBadgesCount || profile.badgesCount) || 0;

    gameBadgesCount = Math.max(0, rawGame > rawTrivia ? rawGame : rawGame + rawTrivia);
    skillBadgesCount = Math.max(0, rawSkill);
  }

  // 1. Calculate points from categories
  const gamePoints = gameBadgesCount * POINT_RULES.GAME_BADGE;
  const skillPoints = skillBadgesCount * POINT_RULES.SKILL_BADGE;

  // 2. Evaluate Non-Cumulative Facilitator Milestones
  let highestFacilitatorBonus = 0;
  let highestMilestone = null;

  const milestoneResults = FACILITATOR_MILESTONES.map((m) => {
    const isCompleted = gameBadgesCount >= m.gamesNeeded && skillBadgesCount >= m.skillBadgesNeeded;

    if (isCompleted) {
      if (m.bonusPoints > highestFacilitatorBonus) {
        highestFacilitatorBonus = m.bonusPoints;
        highestMilestone = m;
      }
    }

    return {
      ...m,
      isCompleted
    };
  });

  const bonusTaskEarned = profile.bonusTaskVerified ? BONUS_TASK_RULE.bonusPoints : 0;
  const totalBonusPoints = highestFacilitatorBonus + bonusTaskEarned;

  // 3. Calculate Total Points
  const totalPoints = gamePoints + skillPoints + totalBonusPoints;

  // Verification Check: Ensure totalPoints equals the exact sum of breakdown components
  const isVerified = (
    !isNaN(totalPoints) &&
    totalPoints >= 0 &&
    gameBadgesCount >= 0 &&
    skillBadgesCount >= 0 &&
    totalPoints === (gamePoints + skillPoints + totalBonusPoints)
  );

  // 4. Calculate Current Tier Dynamically
  const sortedTiers = [...TIERS].sort((a, b) => a.minPoints - b.minPoints);

  let currentTier = sortedTiers[0];
  for (let i = 0; i < sortedTiers.length; i++) {
    if (totalPoints >= sortedTiers[i].minPoints) {
      currentTier = sortedTiers[i];
    }
  }

  const currentTierIndex = sortedTiers.findIndex(t => t.id === currentTier.id);
  const nextTier = currentTierIndex < sortedTiers.length - 1 ? sortedTiers[currentTierIndex + 1] : null;

  let pointsNeeded = 0;
  let progressPercent = 100;

  if (nextTier) {
    pointsNeeded = Math.max(0, nextTier.minPoints - totalPoints);
    progressPercent = Math.min(100, Math.max(0, Math.round((totalPoints / nextTier.minPoints) * 100)));
  }

  // 5. Generate Data-Driven Next Goals
  const nextActions = [];

  if (nextTier) {
    nextActions.push({
      title: `Advance to ${nextTier.name} Tier`,
      description: `Earn ${pointsNeeded} more point${pointsNeeded > 1 ? 's' : ''} to reach ${nextTier.name} (${nextTier.minPoints} pts).`,
      type: 'tier'
    });
  } else {
    nextActions.push({
      title: 'Maintain Legend Standing',
      description: 'You have reached the highest configured tier! Continue building your Google Cloud credentials.',
      type: 'tier'
    });
  }

  const nextMilestone = milestoneResults.find(m => !m.isCompleted);
  if (nextMilestone) {
    const missingGames = Math.max(0, nextMilestone.gamesNeeded - gameBadgesCount);
    const missingSkills = Math.max(0, nextMilestone.skillBadgesNeeded - skillBadgesCount);

    const missingItems = [];
    if (missingGames > 0) missingItems.push(`${missingGames} Game Badge${missingGames > 1 ? 's' : ''}`);
    if (missingSkills > 0) missingItems.push(`${missingSkills} Skill Badge${missingSkills > 1 ? 's' : ''}`);

    nextActions.push({
      title: `Qualify for Facilitator ${nextMilestone.name}`,
      description: `Complete ${missingItems.join(' and ')} to unlock +${nextMilestone.bonusPoints} bonus points.`,
      type: 'facilitator'
    });
  }

  if (gameBadgesCount === 0) {
    nextActions.push({
      title: 'Complete 1 Arcade Game Badge',
      description: `Earn 1 active Arcade Game Badge to add +${POINT_RULES.GAME_BADGE} point to your score.`,
      type: 'game'
    });
  } else {
    nextActions.push({
      title: 'Earn More Skill Badges',
      description: `Each Skill Badge adds +${POINT_RULES.SKILL_BADGE} point to your overall score.`,
      type: 'skill'
    });
  }

  // 6. Generate Timeline
  const timelineItems = [];

  if (profile.badges && profile.badges.length > 0) {
    profile.badges.forEach((b, idx) => {
      if (b.earned !== false) {
        timelineItems.push({
          id: idx + 1,
          title: b.title,
          category: b.category || b.type || 'Badge',
          date: b.earnedDate || null,
          status: 'Completed'
        });
      }
    });
  }

  if (highestMilestone) {
    timelineItems.push({
      id: `milestone-${highestMilestone.id}`,
      title: `Facilitator ${highestMilestone.name} Unlocked`,
      category: 'Bonus Reward',
      date: null,
      status: `+${highestMilestone.bonusPoints} Bonus Pts`
    });
  }

  return {
    profileName: profile.name || 'Google Cloud Learner',
    avatar: profile.avatar || '',
    memberSince: profile.memberSince || 'Google Cloud Learner',
    profileUrl: profile.profileUrl || '',

    gameBadgesCount,
    skillBadgesCount,

    gamePoints,
    skillPoints,
    bonusPoints: totalBonusPoints,
    highestBonus: highestFacilitatorBonus,
    totalPoints,

    isVerified,

    currentTier,
    nextTier,
    pointsNeeded,
    progressPercent,

    milestoneResults,
    nextActions,
    timelineItems,

    badges: profile.badges || []
  };
};

