import React from 'react';
import { Calculator, CheckCircle2, AlertTriangle } from 'lucide-react';
import { POINT_RULES } from '../config/pointsRules';

export const PointsBreakdown = ({ metrics }) => {
  if (!metrics) return null;

  const {
    gameBadgesCount,
    skillBadgesCount,
    gamePoints,
    skillPoints,
    bonusPoints,
    totalPoints,
    isVerified
  } = metrics;

  return (
    <div className="app-card p-6 space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2A44]">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-[#4285F4]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#E6EAF2]">
            POINTS BREAKDOWN
          </h3>
        </div>

        {isVerified ? (
          <span className="text-[10px] font-bold text-[#34A853] bg-[#34A853]/10 px-2.5 py-1 rounded-full border border-[#34A853]/20 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" /> Calculation verified
          </span>
        ) : (
          <span className="text-[10px] font-bold text-[#EA4335] bg-[#EA4335]/10 px-2.5 py-1 rounded-full border border-[#EA4335]/20 inline-flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-[#EA4335]" /> Calculation verification failed
          </span>
        )}
      </div>

      {/* Verification Failure Message */}
      {!isVerified && (
        <div className="p-3.5 rounded-xl bg-[#EA4335]/10 border border-[#EA4335]/30 text-[#EA4335] text-xs font-semibold">
          Calculation verification failed. Please try again.
        </div>
      )}

      {/* Breakdown Rows */}
      <div className="space-y-3 text-xs">
        
        {/* Game Badges */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B1220] border border-[#1E2A44]">
          <div className="space-y-0.5">
            <span className="font-semibold text-[#E6EAF2] block">
              Game Badges
            </span>
            <span className="text-[11px] text-[#FBBC04] font-medium">
              {gameBadgesCount} × {POINT_RULES.GAME_BADGE} pt
            </span>
          </div>
          <span className="font-bold text-[#E6EAF2] text-sm">
            = {gamePoints} pts
          </span>
        </div>

        {/* Skill Badges */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B1220] border border-[#1E2A44]">
          <div className="space-y-0.5">
            <span className="font-semibold text-[#E6EAF2] block">
              Skill Badges
            </span>
            <span className="text-[11px] text-[#4285F4] font-medium">
              {skillBadgesCount} × {POINT_RULES.SKILL_BADGE} pt
            </span>
          </div>
          <span className="font-bold text-[#E6EAF2] text-sm">
            = {skillPoints} pts
          </span>
        </div>

        {/* Facilitator Bonus */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B1220] border border-[#1E2A44]">
          <div className="space-y-0.5">
            <span className="font-semibold text-[#E6EAF2] block">
              Facilitator Bonus
            </span>
            <span className="text-[11px] text-[#34A853] font-medium">
              Highest eligible milestone
            </span>
          </div>
          <span className="font-bold text-[#34A853] text-sm">
            = {bonusPoints} pts
          </span>
        </div>

        {/* TOTAL SCORE */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#4285F4]/10 border border-[#4285F4]/30 pt-3">
          <span className="font-bold text-xs uppercase tracking-wider text-[#E6EAF2]">
            TOTAL SCORE
          </span>
          <span className="font-extrabold text-[#4285F4] text-base sm:text-lg">
            {totalPoints} POINTS
          </span>
        </div>

      </div>

    </div>
  );
};

export default PointsBreakdown;
