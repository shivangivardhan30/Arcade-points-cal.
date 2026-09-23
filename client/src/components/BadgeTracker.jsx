import React, { useState } from 'react';
import { Award, CheckCircle2, Circle, Search, Filter } from 'lucide-react';

export const BadgeTracker = ({ metrics }) => {
  if (!metrics) return null;

  const { badges, skillBadgesCount, gameBadgesCount } = metrics;
  const [filter, setFilter] = useState('all'); // 'all' | 'completed' | 'incomplete'
  const [search, setSearch] = useState('');

  const hasBadgesArray = Array.isArray(badges) && badges.length > 0;

  const filteredBadges = hasBadgesArray
    ? badges.filter(b => {
        const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase());
        if (filter === 'completed') return matchesSearch && b.earned !== false;
        if (filter === 'incomplete') return matchesSearch && b.earned === false;
        return matchesSearch;
      })
    : [];

  return (
    <div className="glass-card p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-6 hover-lift glow-card">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
              Badge Progress
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Completed and remaining Arcade credentials
            </p>
          </div>
        </div>

        {hasBadgesArray && (
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search badges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${filter === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-2.5 py-1 rounded-lg transition-all ${filter === 'completed' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500'}`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('incomplete')}
                className={`px-2.5 py-1 rounded-lg transition-all ${filter === 'incomplete' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500'}`}
              >
                Remaining
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Badges Render */}
      {hasBadgesArray ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-h-80 overflow-y-auto pr-1">
          {filteredBadges.map((badge, idx) => {
            const isCompleted = badge.earned !== false;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                  isCompleted
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-800 dark:text-slate-200'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">
                    {badge.category || badge.type || 'Badge'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug truncate block">
                    {badge.title}
                  </h4>
                </div>

                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Summary Counts Fallback when exact badge titles are unavailable */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 block">Completed Skill Badges</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white">{skillBadgesCount}</span>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 block">Completed Game Badges</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white">{gameBadgesCount}</span>
            </div>
            <CheckCircle2 className="w-6 h-6 text-amber-500" />
          </div>
        </div>
      )}

    </div>
  );
};
