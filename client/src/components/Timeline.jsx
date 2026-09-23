import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

export const Timeline = ({ metrics }) => {
  if (!metrics || !metrics.timelineItems || metrics.timelineItems.length === 0) return null;

  return (
    <div className="glass-card p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-4 hover-lift glow-card">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-800">
        <Clock className="w-5 h-5 text-indigo-500" />
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
          Achievement Timeline
        </h3>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {metrics.timelineItems.map((item, idx) => (
          <div key={idx} className="relative flex items-center justify-between text-xs font-bold">
            <span className="absolute -left-6.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-950" />
            <div className="space-y-0.5">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-500 block">
                {item.category}
              </span>
              <h4 className="text-slate-800 dark:text-slate-200 font-bold">
                {item.title}
              </h4>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
