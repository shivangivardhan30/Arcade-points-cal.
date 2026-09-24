import React from 'react';
import { Search, Calculator, Trophy } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Enter Public Profile URL',
      description: 'Paste your public Google Skills Boost profile URL into the search box above.',
      Icon: Search,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      num: '02',
      title: 'Calculate Arcade Progress',
      description: 'Our engine parses earned badges and calculates game points, skill points, and bonuses.',
      Icon: Calculator,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      num: '03',
      title: 'View Breakdown & Goals',
      description: 'Review your total score, dynamic tier standing, and next goal milestones.',
      Icon: Trophy,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div id="progress" className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
          Simple Process
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
          How It Works
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, idx) => {
          const { Icon } = s;
          return (
            <div
              key={idx}
              className="glass-card p-6 border border-[#123a63] bg-[#07111f]/90 rounded-3xl space-y-4 hover-lift glow-card relative"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3.5 rounded-2xl border ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-black font-mono text-slate-500">
                  {s.num}
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-white">
                {s.title}
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                {s.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HowItWorks;
