import React from 'react';
import { Gamepad2, Award, Star, Trophy, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const SummaryCards = ({ metrics }) => {
  if (!metrics) return null;

  const {
    totalPoints,
    gameBadgesCount,
    skillBadgesCount,
    earnedFacilitatorBonus,
    currentTier
  } = metrics;

  const cards = [
    {
      title: 'Game Badges',
      value: gameBadgesCount,
      unit: 'Earned',
      description: 'Arcade Level & Special Games',
      Icon: Gamepad2,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Skill Badges',
      value: skillBadgesCount,
      unit: 'Completed',
      description: 'Hands-on Cloud Assessment Badges',
      Icon: Award,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Bonus Points',
      value: `+${earnedFacilitatorBonus}`,
      unit: 'Pts',
      description: 'Facilitator Program Milestones',
      Icon: Star,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
    },
    {
      title: 'Current Tier',
      value: currentTier.name,
      unit: 'Standing',
      description: currentTier.description,
      Icon: Trophy,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header & Total Points Section */}
      <div className="text-center space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
          Your Arcade Progress
        </span>

        <div className="flex justify-center items-baseline gap-2 pt-2">
          <motion.h2
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white font-heading tracking-tight"
          >
            {totalPoints}
          </motion.h2>
          <span className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            Points
          </span>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, idx) => {
          const { Icon } = c;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="glass-card p-5 hover-lift glow-card border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {c.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${c.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-slate-850 dark:text-white font-heading">
                  {c.value}
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-tight mt-1">
                  {c.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
