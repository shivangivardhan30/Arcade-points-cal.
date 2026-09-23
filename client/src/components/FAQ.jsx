import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: 'What is the Arcade Points Calculator?',
      a: 'Arcade Points Calculator is a community utility that parses your public Google Skills Boost profile link to compute total points, badge achievements, tier standings, and next goals.'
    },
    {
      q: 'How are points calculated?',
      a: 'Points are computed matching centralized configured rules: 1.0 point per completed Game Badge, 0.5 point per completed Skill Badge, 1.0 point per Trivia badge, and bonus points for Facilitator program milestones.'
    },
    {
      q: 'Why is my profile not being detected?',
      a: 'Ensure that you enter the complete public profile URL format (starting with https://cloudskillsboost.google/public_profiles/ or https://skills.google/public_profiles/). Verify that your public visibility option is enabled.'
    },
    {
      q: 'Why does my profile need to be public?',
      a: 'The calculator reads public badge credentials from your profile page HTML. If profile privacy is enabled, external requests cannot inspect your badges.'
    },
    {
      q: 'Can Arcade point rules change?',
      a: 'Yes, official Google Cloud Arcade rules or Facilitator cohort guidelines may update. Our application maintains centralized configuration files so rules can easily be adjusted.'
    },
    {
      q: 'Can I recalculate my progress?',
      a: 'Yes! You can re-enter your profile URL or click "Calculate Again" anytime to update your progress metrics.'
    }
  ];

  return (
    <div id="faq" className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Got Questions?
        </span>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="glass-card border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-indigo-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
