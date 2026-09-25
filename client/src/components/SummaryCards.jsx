import React from 'react';
import { Gamepad2, Award, Star, Trophy } from 'lucide-react';

export const SummaryCards = ({ metrics }) => {
  if (!metrics) return null;

  const {
    gameBadgesCount,
    gamePoints,
    skillBadgesCount,
    skillPoints,
    bonusPoints,
    currentTier,
    totalPoints
  } = metrics;

  const cards = [
    {
      title: 'GAME BADGES',
      value: gameBadgesCount,
      subValue: `+${gamePoints} Points`,
      Icon: Gamepad2,
      chipStyle: 'text-[#FBBC04] bg-[#FBBC04]/10 border-[#FBBC04]/20'
    },
    {
      title: 'SKILL BADGES',
      value: skillBadgesCount,
      subValue: `+${skillPoints} Points`,
      Icon: Award,
      chipStyle: 'text-[#4285F4] bg-[#4285F4]/10 border-[#4285F4]/20'
    },
    {
      title: 'BONUS',
      value: bonusPoints > 0 ? `+${bonusPoints}` : '0',
      subValue: 'Facilitator Bonus',
      Icon: Star,
      chipStyle: 'text-[#34A853] bg-[#34A853]/10 border-[#34A853]/20'
    },
    {
      title: 'CURRENT TIER',
      value: currentTier.name,
      subValue: `${totalPoints} Points Total`,
      Icon: Trophy,
      chipStyle: 'text-[#FBBC04] bg-[#FBBC04]/10 border-[#FBBC04]/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => {
        const { Icon } = c;
        return (
          <div
            key={idx}
            className="app-card p-5 space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                {c.title}
              </span>
              <div className={`p-2 rounded-xl border ${c.chipStyle}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold text-[#E6EAF2] truncate">
                {c.value}
              </div>
              <span className="text-xs font-semibold text-[#4285F4] block">
                {c.subValue}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
