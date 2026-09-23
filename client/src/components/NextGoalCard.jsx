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
    <div className="glass-card p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-5 hover-lift glow-card">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-500" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
            NEXT GOAL
          </h3>
        </div>
        {nextTier && (
          <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">
            Target: {nextTier.name}
          </span>
        )}
      </div>

      {nextTier ? (
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                TARGET TIER
              </span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white font-heading">
                {nextTier.name}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                Required: <strong className="text-slate-900 dark:text-white">{nextTier.minPoints} Pts</strong>
              </span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                Remaining: {pointsNeeded} Pts
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Current: {totalPoints}</span>
              <span>Target: {nextTier.minPoints}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-200 dark:border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-brand h-full rounded-full"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
          <Sparkles className="w-6 h-6 text-emerald-500 mx-auto" />
          <h4 className="text-sm font-black text-slate-900 dark:text-white">Maximum Tier Reached</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">You hold Legend standing!</p>
        </div>
      )}

      {/* What you can work toward */}
      {nextActions && nextActions.length > 0 && (
        <div className="pt-2 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            What you can work toward
          </span>

          <div className="space-y-2">
            {nextActions.map((action, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5 text-xs"
              >
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-800 dark:text-slate-200">{action.title}</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-0.5">
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
