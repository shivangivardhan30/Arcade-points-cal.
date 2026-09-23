/**
 * Centralized Tier Configuration
 * Tiers are evaluated based on minimum points required.
 */
export const TIERS = [
  {
    id: "explorer",
    name: "Explorer",
    minPoints: 0,
    icon: "Compass",
    color: "indigo",
    description: "Getting started in Google Cloud Arcade"
  },
  {
    id: "novice",
    name: "Novice",
    minPoints: 10,
    icon: "Award",
    color: "blue",
    description: "Standard Arcade eligibility threshold"
  },
  {
    id: "trooper",
    name: "Trooper",
    minPoints: 25,
    icon: "Shield",
    color: "purple",
    description: "Active contributor with multiple skill badges"
  },
  {
    id: "ranger",
    name: "Ranger",
    minPoints: 50,
    icon: "Target",
    color: "amber",
    description: "Experienced learner mastering cloud architecture"
  },
  {
    id: "champion",
    name: "Champion",
    minPoints: 75,
    icon: "Trophy",
    color: "emerald",
    description: "Top-tier Arcade participant"
  },
  {
    id: "legend",
    name: "Legend",
    minPoints: 100,
    icon: "Crown",
    color: "yellow",
    description: "Highest currently configured Arcade milestone"
  }
];
