import React from 'react';
import { Search, Calculator, Trophy } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Enter Public Profile URL',
      description: 'Paste your Google Skills Boost public profile URL into the calculator.',
      Icon: Search,
      color: 'text-blue-500 bg-blue-500/10'
    },
    {
      num: '02',
      title: 'Calculate Arcade Progress',
      description: 'Our engine parses completed credentials and applies centralized point rules.',
      Icon: Calculator,
      color: 'text-indigo-500 bg-indigo-500/10'
    },
    {
      num: '03',
      title: 'View Breakdown & Goals',
      description: 'Review your total score, current tier standing, and data-driven next steps.',
      Icon: Trophy,
      color: 'text-emerald-500 bg-emerald-500/10'
    }
  ];

  return (
    <div id="how-it-works" className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Simple Process
        </span>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
          How It Works
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, idx) => {
          const { Icon } = s;
          return (
            <div
              key={idx}
              className="glass-card p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-4 hover-lift glow-card relative"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3.5 rounded-2xl ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-black font-mono text-slate-400">
                  {s.num}
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-850 dark:text-white">
                {s.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {s.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
