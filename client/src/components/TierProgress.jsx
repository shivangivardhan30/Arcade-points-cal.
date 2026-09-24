import React from 'react';
import { Trophy, CheckCircle2, Sparkles, Circle } from 'lucide-react';
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

  const tiersList = [
    { name: 'Trooper', minPoints: 50 },
    { name: 'Ranger', minPoints: 75 },
    { name: 'Champion', minPoints: 95 },
    { name: 'Legend', minPoints: 120 }
  ];

  return (
    <div className="glass-card p-6 border border-[#123a63] bg-[#07111f]/90 rounded-3xl space-y-6 hover-lift glow-card">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#123a63]/50">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
            Arcade Tier Progression
          </h3>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full">
          {currentTier.name} Standing
        </span>
      </div>

      {/* Current Tier vs Next Tier Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* CURRENT TIER */}
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 block">
            CURRENT TIER
          </span>
          <h4 className="text-lg font-black text-white">
            {currentTier.name}
          </h4>
          <p className="text-xs font-bold text-blue-300">
            {totalPoints} Points Total
          </p>
        </div>

        {/* NEXT TIER */}
        {nextTier ? (
          <div className="p-4 rounded-2xl bg-[#0b1f33] border border-[#123a63] space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              NEXT TIER
            </span>
            <h4 className="text-lg font-black text-slate-200">
              {nextTier.name}
            </h4>
            <p className="text-xs font-bold text-slate-400">
              {nextTier.minPoints} Points Required
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block">
                MAXIMUM TIER
              </span>
              <h4 className="text-base font-black text-white">
                Legend Standing
              </h4>
            </div>
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
        )}

      </div>

      {/* Animated Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-400">
            {nextTier ? `${totalPoints} / ${nextTier.minPoints} Points` : `${totalPoints} Points`}
          </span>
          <span className="text-blue-400 font-black">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-[#0b1f33] rounded-full h-3.5 overflow-hidden border border-[#123a63] p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-gradient-to-r from-blue-600 to-emerald-400 h-full rounded-full"
          />
        </div>

        <p className="text-xs font-bold text-slate-300 text-center pt-1">
          {nextTier
            ? `${pointsNeeded} points needed for ${nextTier.name}`
            : 'Congratulations! You have reached Legend standing!'}
        </p>
      </div>

      {/* Tier Milestone Checklist */}
      <div className="pt-2 border-t border-[#123a63]/50">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">
          Tier Roadmap
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          {tiersList.map((t, idx) => {
            const isReached = totalPoints >= t.minPoints;
            const isCurrent = currentTier.name.toLowerCase() === t.name.toLowerCase();

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-colors ${
                  isCurrent
                    ? 'bg-blue-500/20 border-blue-500/50 text-white shadow-lg'
                    : isReached
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-slate-200'
                    : 'bg-[#0b1f33]/40 border-[#123a63] text-slate-500'
                }`}
              >
                {isReached ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
                <span className="font-extrabold text-xs">{t.name}</span>
                <span className="text-[10px] font-mono text-slate-400">{t.minPoints} Pts</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default TierProgress;
