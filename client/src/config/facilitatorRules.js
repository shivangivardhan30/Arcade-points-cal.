/**
 * Centralized Facilitator Program Rules
 * Milestone bonuses are NON-CUMULATIVE (highest eligible bonus applies).
 */
export const FACILITATOR_MILESTONES = [
  {
    id: 1,
    name: 'Milestone 1',
    gamesNeeded: 6,
    skillBadgesNeeded: 18,
    bonusPoints: 5,
    description: '6 Game Badges + 18 Skill Badges'
  },
  {
    id: 2,
    name: 'Milestone 2',
    gamesNeeded: 8,
    skillBadgesNeeded: 34,
    bonusPoints: 15,
    description: '8 Game Badges + 34 Skill Badges'
  },
  {
    id: 3,
    name: 'Milestone 3',
    gamesNeeded: 10,
    skillBadgesNeeded: 50,
    bonusPoints: 25,
    description: '10 Game Badges + 50 Skill Badges'
  },
  {
    id: 4,
    name: 'Ultimate Milestone',
    gamesNeeded: 12,
    skillBadgesNeeded: 66,
    bonusPoints: 35,
    description: '12 Game Badges + 66 Skill Badges'
  }
];

export const BONUS_TASK_RULE = {
  bonusPoints: 10,
  description: 'Eligible Bonus Task'
};
