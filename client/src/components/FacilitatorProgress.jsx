import React from 'react';
import { Target, CheckCircle2, Circle } from 'lucide-react';

export const FacilitatorProgress = ({ metrics }) => {
  if (!metrics) return null;

  const {
    milestoneResults,
    bonusPoints
  } = metrics;

  return (
    <div className="glass-card p-6 border border-[#123a63] bg-[#07111f]/90 rounded-3xl space-y-6 hover-lift glow-card">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#123a63]/50">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              FACILITATOR PROGRESS
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Cohort milestone bonus requirements (Non-cumulative)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Highest Bonus Earned: +{bonusPoints} Pts
          </span>
        </div>
      </div>

      {/* Milestones Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {milestoneResults.map((m) => (
          <div
            key={m.id}
            className={`p-4 rounded-2xl border flex items-start justify-between gap-3 transition-colors ${
              m.isCompleted
                ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                : 'bg-[#0b1f33] border-[#123a63] text-slate-400'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {m.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <h4 className={`text-xs font-bold ${m.isCompleted ? 'text-emerald-300' : 'text-slate-200'}`}>
                  {m.name}
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 font-medium pl-6">
                Need: {m.gamesNeeded} Games & {m.skillBadgesNeeded} Skills
              </p>
              <p className="text-[10px] font-extrabold text-blue-400 pl-6 uppercase">
                Reward: +{m.bonusPoints} Bonus Pts
              </p>
            </div>

            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
              m.isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#07111f] text-slate-500'
            }`}>
              {m.isCompleted ? 'Completed' : 'Pending'}
            </span>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex justify-between items-center text-xs font-bold text-slate-300">
        <span>Facilitator Milestone Rule:</span>
        <span className="text-blue-400 font-extrabold">
          Awards strictly the single highest eligible bonus (+35 max)
        </span>
      </div>

    </div>
  );
};

export default FacilitatorProgress;
