import React from 'react';
import { Activity } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 glass-card border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-6 animate-pulse glow-card">
      <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <Activity className="w-6 h-6 text-indigo-500 animate-bounce" />
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
          Analyzing your Arcade profile...
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Extracting completed Skill Badges, Game Badges, and Facilitator milestones.
        </p>
      </div>

      {/* Skeleton placeholders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-slate-100 dark:bg-slate-900 rounded-xl" />
        ))}
      </div>
    </div>
  );
};
