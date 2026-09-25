import React, { useState } from 'react';
import { Award, CheckCircle2, Circle, Search } from 'lucide-react';

export const BadgeTracker = ({ metrics }) => {
  if (!metrics) return null;

  const { badges, skillBadgesCount, gameBadgesCount } = metrics;
  const [filter, setFilter] = useState('all'); // 'all' | 'completed' | 'incomplete'
  const [search, setSearch] = useState('');

  const hasBadgesArray = Array.isArray(badges) && badges.length > 0;

  const filteredBadges = hasBadgesArray
    ? badges.filter(b => {
        const matchesSearch = (b.title || '').toLowerCase().includes(search.toLowerCase());
        if (filter === 'completed') return matchesSearch && b.earned !== false;
        if (filter === 'incomplete') return matchesSearch && b.earned === false;
        return matchesSearch;
      })
    : [];

  return (
    <div className="app-card p-6 space-y-6 border-t-2 border-t-[#4285F4]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#1E2A44]">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#4285F4]" />
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#E6EAF2]">
              BADGE OVERVIEW
            </h3>
            <p className="text-xs text-[#94A3B8] font-medium">
              Completed and missing Arcade credentials
            </p>
          </div>
        </div>

        {hasBadgesArray && (
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-3.5 h-3.5 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search badges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs font-semibold outline-none text-[#E6EAF2] focus:border-[#4285F4]"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#0B1220] p-1 rounded-xl border border-[#1E2A44] text-xs font-bold">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${filter === 'all' ? 'bg-[#4285F4] text-white shadow' : 'text-[#94A3B8]'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-2.5 py-1 rounded-lg transition-all ${filter === 'completed' ? 'bg-[#4285F4] text-white shadow' : 'text-[#94A3B8]'}`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('incomplete')}
                className={`px-2.5 py-1 rounded-lg transition-all ${filter === 'incomplete' ? 'bg-[#4285F4] text-white shadow' : 'text-[#94A3B8]'}`}
              >
                Remaining
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Badges Grid */}
      {hasBadgesArray ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-h-80 overflow-y-auto pr-1">
          {filteredBadges.map((badge, idx) => {
            const isCompleted = badge.earned !== false;
            const isSkill = (badge.category || badge.type || '').toLowerCase().includes('skill');
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                  isCompleted
                    ? 'bg-[#34A853]/10 border-[#34A853]/30 text-[#E6EAF2]'
                    : 'bg-[#EA4335]/10 border-[#EA4335]/20 text-[#94A3B8]'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    isSkill 
                      ? 'text-[#4285F4] bg-[#4285F4]/10 border-[#4285F4]/20' 
                      : 'text-[#FBBC04] bg-[#FBBC04]/10 border-[#FBBC04]/20'
                  }`}>
                    {badge.category || badge.type || 'Badge'}
                  </span>
                  <h4 className="text-xs font-bold text-[#E6EAF2] leading-snug truncate block">
                    {badge.title}
                  </h4>
                </div>

                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#34A853] shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-[#EA4335] shrink-0 mt-0.5" />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Summary Counts Fallback */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0B1220] border border-[#1E2A44] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#94A3B8] block">Completed Skill Badges</span>
              <span className="text-2xl font-black text-[#E6EAF2]">{skillBadgesCount}</span>
            </div>
            <CheckCircle2 className="w-6 h-6 text-[#4285F4]" />
          </div>

          <div className="p-4 rounded-xl bg-[#0B1220] border border-[#1E2A44] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#94A3B8] block">Completed Game Badges</span>
              <span className="text-2xl font-black text-[#E6EAF2]">{gameBadgesCount}</span>
            </div>
            <CheckCircle2 className="w-6 h-6 text-[#FBBC04]" />
          </div>
        </div>
      )}

    </div>
  );
};

export default BadgeTracker;
