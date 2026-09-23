import React from 'react';
import { Target, CheckCircle2, Circle, Gift, Sparkles } from 'lucide-react';

export const FacilitatorProgress = ({ metrics }) => {
  if (!metrics) return null;

  const {
    milestoneResults,
    earnedFacilitatorBonus,
    remainingFacilitatorBonus
  } = metrics;

  return (
    <div className="glass-card p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-6 hover-lift glow-card">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
              Facilitator Progress
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Cohort milestones and bonus points tracker
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Bonus Earned: +{earnedFacilitatorBonus}
          </span>
        </div>
      </div>

      {/* Milestones List */}
      <div className="grid gap-3 sm:grid-cols-2">
        {milestoneResults.map((m) => (
          <div
            key={m.id}
            className={`p-4 rounded-2xl border flex items-start justify-between gap-3 transition-colors ${
              m.isCompleted
                ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-800 dark:text-slate-200'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {m.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <h4 className={`text-xs font-bold ${m.isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {m.name}
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 font-medium pl-6">
                {m.description}
              </p>
              <p className="text-[10px] font-extrabold text-indigo-500 pl-6 uppercase">
                Bonus Reward: +{m.bonusPoints} Pts
              </p>
            </div>

            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
              m.isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
            }`}>
              {m.isCompleted ? 'Completed' : 'Pending'}
            </span>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 flex justify-between items-center text-xs font-bold">
        <span className="text-slate-600 dark:text-slate-300">Remaining Available Bonus:</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
          +{remainingFacilitatorBonus} Points
        </span>
      </div>

    </div>
  );
};
