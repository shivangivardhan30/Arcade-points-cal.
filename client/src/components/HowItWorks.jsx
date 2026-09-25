import React from 'react';
import { Search, Calculator, Trophy } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Enter Public Profile URL',
      description: 'Paste your public Google Skills Boost profile URL into the search box above.',
      Icon: Search,
      color: 'text-[#4285F4] bg-[#4285F4]/10 border-[#4285F4]/20'
    },
    {
      num: '02',
      title: 'Calculate Arcade Progress',
      description: 'Our engine parses earned badges and calculates game points, skill points, and bonuses.',
      Icon: Calculator,
      color: 'text-[#FBBC04] bg-[#FBBC04]/10 border-[#FBBC04]/20'
    },
    {
      num: '03',
      title: 'View Breakdown & Goals',
      description: 'Review your total score, dynamic tier standing, and next goal milestones.',
      Icon: Trophy,
      color: 'text-[#34A853] bg-[#34A853]/10 border-[#34A853]/20'
    }
  ];

  return (
    <div id="progress" className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#4285F4]">
          Simple Process
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#E6EAF2]">
          How It Works
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, idx) => {
          const { Icon } = s;
          return (
            <div
              key={idx}
              className="app-card p-6 space-y-4 relative"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3.5 rounded-xl border ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-black font-mono text-[#94A3B8]">
                  {s.num}
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-[#E6EAF2]">
                {s.title}
              </h3>
              <p className="text-xs text-[#94A3B8] font-medium leading-relaxed">
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
