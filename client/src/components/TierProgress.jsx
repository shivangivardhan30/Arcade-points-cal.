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
    <div className="app-card p-6 space-y-6 border-t-2 border-t-[#FBBC04]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2A44]">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#FBBC04]" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#E6EAF2]">
            Arcade Tier Progression
          </h3>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/20 px-3 py-1 rounded-full">
          {currentTier.name} Standing
        </span>
      </div>

      {/* Current Tier vs Next Tier Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* CURRENT TIER */}
        <div className="p-4 rounded-xl bg-[#4285F4]/10 border border-[#4285F4]/30 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4285F4] block">
            CURRENT TIER
          </span>
          <h4 className="text-lg font-black text-[#E6EAF2]">
            {currentTier.name}
          </h4>
          <p className="text-xs font-bold text-[#4285F4]">
            {totalPoints} Points Total
          </p>
        </div>

        {/* NEXT TIER */}
        {nextTier ? (
          <div className="p-4 rounded-xl bg-[#0B1220] border border-[#1E2A44] space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] block">
              NEXT TIER
            </span>
            <h4 className="text-lg font-black text-[#E6EAF2]">
              {nextTier.name}
            </h4>
            <p className="text-xs font-bold text-[#94A3B8]">
              {nextTier.minPoints} Points Required
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#34A853]/10 border border-[#34A853]/20 space-y-1 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#34A853] block">
                MAXIMUM TIER
              </span>
              <h4 className="text-base font-black text-[#E6EAF2]">
                Legend Standing
              </h4>
            </div>
            <Sparkles className="w-6 h-6 text-[#34A853]" />
          </div>
        )}

      </div>

      {/* Animated Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-[#94A3B8]">
            {nextTier ? `${totalPoints} / ${nextTier.minPoints} Points` : `${totalPoints} Points`}
          </span>
          <span className="text-[#4285F4] font-black">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-[#0B1220] rounded-full h-3.5 overflow-hidden border border-[#1E2A44] p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-gradient-to-r from-[#4285F4] to-[#34A853] h-full rounded-full"
          />
        </div>

        <p className="text-xs font-bold text-[#94A3B8] text-center pt-1">
          {nextTier
            ? `${pointsNeeded} points needed for ${nextTier.name}`
            : 'Congratulations! You have reached Legend standing!'}
        </p>
      </div>

      {/* Tier Milestone Checklist */}
      <div className="pt-2 border-t border-[#1E2A44]">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] block mb-3">
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
                    ? 'bg-[#4285F4]/20 border-[#4285F4]/50 text-[#E6EAF2] shadow-lg'
                    : isReached
                    ? 'bg-[#34A853]/10 border-[#34A853]/20 text-[#E6EAF2]'
                    : 'bg-[#0B1220] border-[#1E2A44] text-[#94A3B8]'
                }`}
              >
                {isReached ? (
                  <CheckCircle2 className="w-4 h-4 text-[#34A853]" />
                ) : (
                  <Circle className="w-4 h-4 text-[#94A3B8]" />
                )}
                <span className="font-extrabold text-xs">{t.name}</span>
                <span className="text-[10px] font-mono text-[#94A3B8]">{t.minPoints} Pts</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default TierProgress;
