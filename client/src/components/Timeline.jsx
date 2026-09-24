import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

export const Timeline = ({ metrics }) => {
  if (!metrics || !metrics.timelineItems || metrics.timelineItems.length === 0) return null;

  return (
    <div className="glass-card p-6 border border-[#123a63] bg-[#07111f]/90 rounded-3xl space-y-4 hover-lift glow-card">
      <div className="flex items-center gap-2 pb-3 border-b border-[#123a63]/50">
        <Clock className="w-5 h-5 text-blue-400" />
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
          ACHIEVEMENT TIMELINE
        </h3>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#123a63]">
        {metrics.timelineItems.map((item, idx) => (
          <div key={idx} className="relative flex items-center justify-between text-xs font-bold gap-3">
            <span className="absolute -left-6.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-[#050b14]" />
            <div className="space-y-0.5 min-w-0">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-400 block">
                {item.category} {item.date ? `• ${item.date}` : ''}
              </span>
              <h4 className="text-slate-200 font-bold truncate">
                {item.title}
              </h4>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
