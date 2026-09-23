import React from 'react';
import { Calculator, CheckCircle } from 'lucide-react';
import { POINT_RULES } from '../config/pointsRules';

export const PointsBreakdown = ({ metrics }) => {
  if (!metrics) return null;

  const {
    gameBadgesCount,
    skillBadgesCount,
    triviaBadgesCount,
    questsCount,
    gamePoints,
    skillPoints,
    triviaPoints,
    questPoints,
    earnedFacilitatorBonus,
    totalPoints
  } = metrics;

  const rows = [
    {
      label: 'Game Badges',
      math: `${gameBadgesCount} × ${POINT_RULES.gameBadge} pt`,
      points: gamePoints,
      color: 'text-amber-500'
    },
    {
      label: 'Skill Badges',
      math: `${skillBadgesCount} × ${POINT_RULES.skillBadge} pt`,
      points: skillPoints,
      color: 'text-blue-500'
    },
    ...(triviaBadgesCount > 0 ? [{
      label: 'Trivia Badges',
      math: `${triviaBadgesCount} × ${POINT_RULES.triviaBadge} pt`,
      points: triviaPoints,
      color: 'text-purple-500'
    }] : []),
    ...(questsCount > 0 ? [{
      label: 'Quests Completed',
      math: `${questsCount} × ${POINT_RULES.quest} pt`,
      points: questPoints,
      color: 'text-indigo-500'
    }] : []),
    {
      label: 'Facilitator Milestone Bonus',
      math: earnedFacilitatorBonus > 0 ? `Milestone Bonus` : `0 Bonus`,
      points: earnedFacilitatorBonus,
      color: 'text-emerald-500'
    }
  ];

  return (
    <div className="glass-card p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-4 hover-lift glow-card">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-800">
        <Calculator className="w-5 h-5 text-indigo-500" />
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
          Points Breakdown
        </h3>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40"
          >
            <div className="flex items-center gap-2 font-sans font-semibold text-slate-700 dark:text-slate-200">
              <span className={`font-bold ${row.color}`}>{row.label}</span>
              <span className="text-[11px] text-slate-400">({row.math})</span>
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white">
              = {row.points} pts
            </span>
          </div>
        ))}

        {/* Total Summary Row */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 font-sans">
          <span className="font-black uppercase tracking-wider text-slate-900 dark:text-white text-xs">
            TOTAL SCORE
          </span>
          <span className="font-black text-indigo-600 dark:text-indigo-400 text-base">
            {totalPoints} Points
          </span>
        </div>
      </div>
    </div>
  );
};
