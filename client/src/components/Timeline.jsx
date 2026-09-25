import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

export const Timeline = ({ metrics }) => {
  if (!metrics || !metrics.timelineItems || metrics.timelineItems.length === 0) return null;

  return (
    <div className="app-card p-6 space-y-4 border-t-2 border-t-[#4285F4]">
      <div className="flex items-center gap-2 pb-3 border-b border-[#1E2A44]">
        <Clock className="w-5 h-5 text-[#4285F4]" />
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#E6EAF2]">
          ACHIEVEMENT TIMELINE
        </h3>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1E2A44]">
        {metrics.timelineItems.map((item, idx) => (
          <div key={idx} className="relative flex items-center justify-between text-xs font-bold gap-3">
            <span className="absolute -left-6.5 w-3 h-3 rounded-full bg-[#4285F4] ring-4 ring-[#0B1220]" />
            <div className="space-y-0.5 min-w-0">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#4285F4] block">
                {item.category} {item.date ? `• ${item.date}` : ''}
              </span>
              <h4 className="text-[#E6EAF2] font-bold truncate">
                {item.title}
              </h4>
            </div>
            <span className="text-[10px] font-extrabold text-[#34A853] bg-[#34A853]/10 px-2 py-0.5 rounded border border-[#34A853]/20 shrink-0">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
