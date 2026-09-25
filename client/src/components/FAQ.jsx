import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: 'What is the Arcade Points Calculator?',
      a: 'Arcade Points Calculator is a community tool that parses public Google Skills Boost profiles to calculate total points, badge achievements, milestone bonuses, and dynamic tier standings.'
    },
    {
      q: 'How are Arcade points calculated?',
      a: 'Points are computed according to official rules: 1.0 point per Arcade Game Badge (including Trivia badges), 0.5 point per Skill Badge, and non-cumulative bonus points awarded for Facilitator cohort milestones.'
    },
    {
      q: 'Why is my profile returning an error?',
      a: 'Ensure that your Google Skills Boost profile is set to Public in your profile account settings and that your input URL starts with https://www.cloudskillsboost.google/public_profiles/.'
    },
    {
      q: 'How does the Facilitator Bonus calculation work?',
      a: 'Facilitator milestone bonuses are non-cumulative. If you qualify for Ultimate milestone (+35), you receive strictly +35 points (not 5 + 15 + 25 + 35). The calculator automatically selects your highest eligible milestone bonus.'
    },
    {
      q: 'What are the tier thresholds?',
      a: 'Tier standings are evaluated dynamically based on total points: Trooper (50 pts), Ranger (75 pts), Champion (95 pts), and Legend (120 pts).'
    },
    {
      q: 'Is this an official Google product?',
      a: 'No. This is an independent community tool created for Google Cloud Arcade learners to track progress.'
    }
  ];

  return (
    <div id="faq" className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#4285F4]">
          Got Questions?
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#E6EAF2]">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="app-card overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-[#E6EAF2] outline-none hover:text-[#4285F4] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#4285F4] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-3 text-xs text-[#94A3B8] leading-relaxed font-medium border-t border-[#1E2A44]">
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

export default FAQ;
