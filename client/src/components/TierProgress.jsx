import React from 'react';
import { Trophy, ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const TierProgress = ({ metrics }) => {
  if (!metrics) return null;

  const {
    totalPoints,
    currentTier,
    nextTier,
    progressPercent,
    pointsNeeded
  } = metrics;

  return (
    <div className="glass-card p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-6 hover-lift glow-card">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
            Arcade Tier Progression
          </h3>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full">
          {currentTier.name} Status
        </span>
      </div>

      {/* Current Tier vs Next Tier Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* CURRENT TIER */}
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
            CURRENT TIER
          </span>
          <h4 className="text-lg font-black text-slate-900 dark:text-white">
            {currentTier.name}
          </h4>
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {totalPoints} Points
          </p>
        </div>

        {/* NEXT TIER */}
        {nextTier ? (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              NEXT TIER
            </span>
            <h4 className="text-lg font-black text-slate-800 dark:text-slate-200">
              {nextTier.name}
            </h4>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {nextTier.minPoints} Points
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                MAXIMUM TIER
              </span>
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                Legend Status
              </h4>
            </div>
            <Sparkles className="w-6 h-6 text-emerald-500" />
          </div>
        )}

      </div>

      {/* Animated Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-500 dark:text-slate-400">
            {nextTier ? `${totalPoints} / ${nextTier.minPoints} Points` : `${totalPoints} Points`}
          </span>
          <span className="text-indigo-600 dark:text-indigo-400 font-black">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-4 overflow-hidden border border-slate-200 dark:border-slate-800 p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-gradient-brand h-full rounded-full shadow"
          />
        </div>

        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 text-center pt-1">
          {nextTier
            ? `${pointsNeeded} points needed for the next tier`
            : 'Congratulations! You have reached the highest currently configured tier.'}
        </p>
      </div>

    </div>
  );
};
