import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';

export const NextActions = ({ metrics }) => {
  if (!metrics || !metrics.nextActions || metrics.nextActions.length === 0) return null;

  return (
    <div className="glass-card p-6 border border-[#123a63] bg-[#07111f]/90 rounded-3xl space-y-4 hover-lift glow-card">
      <div className="flex items-center gap-2 pb-3 border-b border-[#123a63]/50">
        <Compass className="w-5 h-5 text-blue-400" />
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
          WHAT SHOULD I DO NEXT?
        </h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {metrics.nextActions.map((action, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-[#0b1f33] border border-[#123a63] flex items-start gap-3 hover:border-blue-500/40 transition-colors"
          >
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0 mt-0.5 border border-blue-500/20">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-slate-200">
                {action.title}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                {action.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextActions;
