import React from 'react';
import { Target, CheckCircle2, Circle } from 'lucide-react';

export const FacilitatorProgress = ({ metrics }) => {
  if (!metrics) return null;

  const {
    milestoneResults,
    bonusPoints
  } = metrics;

  return (
    <div className="app-card p-6 space-y-6 border-t-2 border-t-[#34A853]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2A44]">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#4285F4]" />
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#E6EAF2]">
              FACILITATOR PROGRESS
            </h3>
            <p className="text-xs text-[#94A3B8] font-medium">
              Cohort milestone bonus requirements (Non-cumulative)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-[#34A853] bg-[#34A853]/10 px-2.5 py-1 rounded-full border border-[#34A853]/20">
            Highest Bonus Earned: +{bonusPoints} Pts
          </span>
        </div>
      </div>

      {/* Milestones Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {milestoneResults.map((m) => (
          <div
            key={m.id}
            className={`p-4 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
              m.isCompleted
                ? 'bg-[#34A853]/10 border-[#34A853]/30 text-[#E6EAF2]'
                : 'bg-[#0B1220] border-[#1E2A44] text-[#94A3B8]'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {m.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#34A853] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[#94A3B8] shrink-0" />
                )}
                <h4 className={`text-xs font-bold ${m.isCompleted ? 'text-[#34A853]' : 'text-[#E6EAF2]'}`}>
                  {m.name}
                </h4>
              </div>
              <p className="text-[11px] text-[#94A3B8] font-medium pl-6">
                Need: {m.gamesNeeded} Games & {m.skillBadgesNeeded} Skills
              </p>
              <p className="text-[10px] font-extrabold text-[#4285F4] pl-6 uppercase">
                Reward: +{m.bonusPoints} Bonus Pts
              </p>
            </div>

            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
              m.isCompleted ? 'bg-[#34A853]/20 text-[#34A853]' : 'bg-[#0B1220] text-[#94A3B8]'
            }`}>
              {m.isCompleted ? 'Completed' : 'Pending'}
            </span>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="p-3.5 rounded-xl bg-[#4285F4]/10 border border-[#4285F4]/20 flex justify-between items-center text-xs font-bold text-[#E6EAF2]">
        <span>Facilitator Milestone Rule:</span>
        <span className="text-[#4285F4] font-extrabold">
          Awards strictly the single highest eligible bonus (+35 max)
        </span>
      </div>

    </div>
  );
};

export default FacilitatorProgress;
