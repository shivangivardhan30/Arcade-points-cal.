import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';

export const NextActions = ({ metrics }) => {
  if (!metrics || !metrics.nextActions || metrics.nextActions.length === 0) return null;

  return (
    <div className="app-card p-6 space-y-4 border-t-2 border-t-[#4285F4]">
      <div className="flex items-center gap-2 pb-3 border-b border-[#1E2A44]">
        <Compass className="w-5 h-5 text-[#4285F4]" />
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#E6EAF2]">
          WHAT SHOULD I DO NEXT?
        </h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {metrics.nextActions.map((action, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#0B1220] border border-[#1E2A44] flex items-start gap-3 hover:border-[#4285F4]/40 transition-colors"
          >
            <div className="p-2 rounded-xl bg-[#4285F4]/10 text-[#4285F4] shrink-0 mt-0.5 border border-[#4285F4]/20">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-[#E6EAF2]">
                {action.title}
              </h4>
              <p className="text-[11px] text-[#94A3B8] font-medium leading-relaxed">
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
