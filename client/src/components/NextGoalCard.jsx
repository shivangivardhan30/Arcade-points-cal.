import React from 'react';
import { Target, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const NextGoalCard = ({ metrics }) => {
  if (!metrics) return null;

  const {
    totalPoints,
    nextTier,
    progressPercent,
    pointsNeeded,
    nextActions
  } = metrics;

  return (
    <div className="app-card p-6 space-y-5 border-t-2 border-t-[#FBBC04]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2A44]">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#FBBC04]" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E6EAF2]">
            NEXT GOAL
          </h3>
        </div>
        {nextTier && (
          <span className="text-[10px] font-extrabold text-[#FBBC04] bg-[#FBBC04]/10 px-2.5 py-1 rounded-full border border-[#FBBC04]/20">
            Target: {nextTier.name}
          </span>
        )}
      </div>

      {nextTier ? (
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] block">
                TARGET TIER
              </span>
              <h4 className="text-xl font-black text-[#E6EAF2]">
                {nextTier.name}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#94A3B8] block">
                Required: <strong className="text-[#E6EAF2]">{nextTier.minPoints} Pts</strong>
              </span>
              <span className="text-xs font-bold text-[#FBBC04]">
                Remaining: {pointsNeeded} Pts
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-[#94A3B8]">
              <span>Current: {totalPoints}</span>
              <span>Target: {nextTier.minPoints}</span>
            </div>
            <div className="w-full bg-[#0B1220] rounded-full h-3 overflow-hidden border border-[#1E2A44]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-r from-[#4285F4] to-[#34A853] h-full rounded-full"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[#34A853]/10 border border-[#34A853]/20 text-center space-y-1">
          <Sparkles className="w-6 h-6 text-[#34A853] mx-auto" />
          <h4 className="text-sm font-black text-[#E6EAF2]">Maximum Tier Reached</h4>
          <p className="text-xs text-[#94A3B8] font-medium">You hold Legend standing!</p>
        </div>
      )}

      {/* What you can work toward */}
      {nextActions && nextActions.length > 0 && (
        <div className="pt-2 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] block">
            How to progress
          </span>

          <div className="space-y-2">
            {nextActions.map((action, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#0B1220] border border-[#1E2A44] flex items-start gap-2.5 text-xs"
              >
                <ArrowRight className="w-3.5 h-3.5 text-[#4285F4] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-[#E6EAF2]">{action.title}</h5>
                  <p className="text-[11px] text-[#94A3B8] font-medium leading-relaxed mt-0.5">
                    {action.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default NextGoalCard;
