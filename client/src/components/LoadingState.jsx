import React from 'react';
import { Cloud } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 app-card text-center space-y-6 animate-pulse">
      <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-[#4285F4]/20 border-t-[#4285F4] animate-spin" />
        <Cloud className="w-6 h-6 text-[#4285F4] animate-bounce" />
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-extrabold text-[#E6EAF2]">
          Analyzing your Google Cloud Skills Boost profile...
        </h3>
        <p className="text-xs text-[#94A3B8] font-medium">
          Evaluating Game Badges, Skill Badges, Trivia, and Facilitator Milestones...
        </p>
      </div>

      {/* Skeleton placeholders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-[#0B1220] rounded-xl border border-[#1E2A44]" />
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
