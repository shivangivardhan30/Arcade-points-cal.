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
    <div className="glass-card p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-5 hover-lift glow-card">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-500" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
            POINTS BREAKDOWN
          </h3>
        </div>

        {isVerified ? (
          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Calculation verified
          </span>
        ) : (
          <span className="text-[10px] font-extrabold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 inline-flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Calculation data needs verification
          </span>
        )}
      </div>

      {/* Breakdown Rows */}
      <div className="space-y-3 font-mono text-xs">
        
        {/* Game Badges */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-800 dark:text-slate-200 font-sans block">
              Game Badges
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              {gameBadgesCount} × {POINT_RULES.GAME_BADGE}
            </span>
          </div>
          <span className="font-extrabold text-slate-900 dark:text-white text-sm">
            = {gamePoints} pts
          </span>
        </div>

        {/* Skill Badges */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-800 dark:text-slate-200 font-sans block">
              Skill Badges
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              {skillBadgesCount} × {POINT_RULES.SKILL_BADGE}
            </span>
          </div>
          <span className="font-extrabold text-slate-900 dark:text-white text-sm">
            = {skillPoints} pts
          </span>
        </div>

        {/* Facilitator Bonus */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-800 dark:text-slate-200 font-sans block">
              Facilitator Bonus
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              Highest eligible milestone
            </span>
          </div>
          <span className="font-extrabold text-slate-900 dark:text-white text-sm">
            = {bonusPoints} pts
          </span>
        </div>

        {/* TOTAL */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 font-sans pt-3">
          <span className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
            TOTAL SCORE
          </span>
          <span className="font-black text-indigo-600 dark:text-indigo-400 text-base sm:text-lg">
            {totalPoints} POINTS
          </span>
        </div>

      </div>

    </div>
  );
};
