/**
 * Centralized Tier Configuration
 * Reference Tiers:
 * - Below 50: Not Reached / Explorer
 * - 50 – 74: Trooper
 * - 75 – 94: Ranger
 * - 95 – 119: Champion
 * - 120+: Legend
 */
export const TIERS = [
  {
    id: 'explorer',
    name: 'Explorer',
    minPoints: 0,
    nextTierMin: 50,
    icon: 'Compass',
    color: 'slate',
    description: 'Below 50 points (Trooper threshold)'
  },
  {
    id: 'trooper',
    name: 'Trooper',
    minPoints: 50,
    nextTierMin: 75,
    icon: 'Shield',
    color: 'blue',
    description: 'Trooper Tier (50+ points)'
  },
  {
    id: 'ranger',
    name: 'Ranger',
    minPoints: 75,
    nextTierMin: 95,
    icon: 'Target',
    color: 'indigo',
    description: 'Ranger Tier (75+ points)'
  },
  {
    id: 'champion',
    name: 'Champion',
    minPoints: 95,
    nextTierMin: 120,
    icon: 'Trophy',
    color: 'purple',
    description: 'Champion Tier (95+ points)'
  },
  {
    id: 'legend',
    name: 'Legend',
    minPoints: 120,
    nextTierMin: null,
    icon: 'Crown',
    color: 'emerald',
    description: 'Legend Tier (120+ points)'
  }
];
