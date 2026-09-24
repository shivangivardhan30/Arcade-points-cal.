import React from 'react';
import { Gamepad2, Award, Star, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

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
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'SKILL BADGES',
      value: skillBadgesCount,
      subValue: `+${skillPoints} Points`,
      Icon: Award,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'BONUS',
      value: bonusPoints > 0 ? `+${bonusPoints}` : '0',
      subValue: 'Facilitator Bonus',
      Icon: Star,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      title: 'CURRENT TIER',
      value: currentTier.name,
      subValue: `${totalPoints} Points Total`,
      Icon: Trophy,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => {
        const { Icon } = c;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="glass-card p-5 hover-lift glow-card border border-[#123a63] bg-[#07111f]/90 rounded-3xl space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                {c.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${c.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-black text-white font-heading truncate">
                {c.value}
              </div>
              <span className="text-xs font-bold text-blue-400 block">
                {c.subValue}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
