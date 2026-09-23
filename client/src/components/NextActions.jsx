import React from 'react';
import { Compass, ArrowRight, CheckCircle2 } from 'lucide-react';

export const NextActions = ({ metrics }) => {
  if (!metrics || !metrics.nextActions || metrics.nextActions.length === 0) return null;

  return (
    <div className="glass-card p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-4 hover-lift glow-card">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-800">
        <Compass className="w-5 h-5 text-indigo-500" />
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
          What should I do next?
        </h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {metrics.nextActions.map((action, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3 hover:border-indigo-500/30 transition-colors"
          >
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0 mt-0.5">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                {action.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {action.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
