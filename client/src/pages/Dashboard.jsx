import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { calculateArcadeMetrics } from '../services/calculatorService';
import { Award, Search, CheckCircle2, Circle, Gift, Calendar, Trophy, Flame, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();

  // Load active analyzed profile from localStorage if available
  const [activeProfile, setActiveProfile] = useState(null);
  const [badgeFilter, setBadgeFilter] = useState('all'); // 'all' | 'completed' | 'unearned'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('active_arcade_profile');
    if (saved) {
      try {
        setActiveProfile(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (!activeProfile) {
    return (
      <div className="glass-card p-12 border border-slate-200/80 dark:border-slate-800 rounded-3xl text-center space-y-5 max-w-2xl mx-auto my-12 glow-card">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">No Profile Analyzed Yet</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
            Please analyze your Google Skills Boost profile first on the Home page to unlock full dashboard analytics and breakdown.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-brand text-white font-bold text-xs hover:opacity-95 transition-opacity shadow-lg shadow-indigo-500/20"
        >
          <span>Go to Analyzer</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const metrics = calculateArcadeMetrics(activeProfile);

  const profileName = metrics.profileName;
  const avatarUrl = metrics.avatar;
  const memberSince = metrics.memberSince;
  
  const skillBadgesCount = metrics.skillBadgesCount;
  const gameBadgesCount = metrics.gameBadgesCount;
  const totalBadges = skillBadgesCount + gameBadgesCount;

  const totalPoints = metrics.totalPoints;
  const bonusPoints = metrics.bonusPoints;
  const currentTier = metrics.currentTier;

  // Swag Tiers Data
  const swagTiers = [
    { name: 'Trooper Tier', requiredPts: 50, img: 'https://cdn.jsdelivr.net/gh/prateekrajput08/ArcadePointsCalci-jsDelivr@main/images/swags/Trooper.png?raw=true', desc: 'Arcade pin set & stickers pack' },
    { name: 'Ranger Tier', requiredPts: 75, img: 'https://cdn.jsdelivr.net/gh/prateekrajput08/ArcadePointsCalci-jsDelivr@main/images/swags/Ranger.png?raw=true', desc: 'Arcade water bottle & notebook' },
    { name: 'Champion Tier', requiredPts: 95, img: 'https://cdn.jsdelivr.net/gh/prateekrajput08/ArcadePointsCalci-jsDelivr@main/images/swags/Champion.png?raw=true', desc: 'Arcade premium jacket & cap' },
    { name: 'Legend Tier', requiredPts: 120, img: 'https://cdn.jsdelivr.net/gh/prateekrajput08/ArcadePointsCalci-jsDelivr@main/images/swags/Legend.png?raw=true', desc: 'VIP Swag Box & Certificate' }
  ];

  const allBadgesList = metrics.badges || [];

  const filteredBadges = allBadgesList.filter(b => {
    const matchesSearch = (b.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (badgeFilter === 'completed') return matchesSearch && (b.earned !== false);
    if (badgeFilter === 'unearned') return matchesSearch && (b.earned === false);
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Grid: Profile Card, Total Points, Badges Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* User Profile Card */}
        <div className="lg:col-span-4 glass-card p-6 flex flex-col justify-between space-y-4 hover-lift glow-card">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/20 border border-slate-200 dark:border-slate-800 shrink-0"
            />
            <div className="space-y-1 min-w-0">
              <h2 className="text-xl font-black text-slate-900 dark:text-white truncate">{profileName}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{memberSince}</p>
              
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-md mt-1">
                <Trophy className="w-3.5 h-3.5 text-indigo-500" />
                <span className="uppercase tracking-wider font-mono text-[10px]">{currentTier.name} Standing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Arcade Points Card */}
        <div className="lg:col-span-4 glass-card p-6 flex flex-col justify-between space-y-3 hover-lift glow-card">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Arcade Points</span>
          
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400 font-heading">
              {totalPoints}
            </span>
            <span className="text-xl font-bold text-slate-700 dark:text-slate-200">Pts</span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg w-fit font-semibold">
            <span>Includes <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">+{bonusPoints} bonus pts</strong></span>
          </div>
        </div>

        {/* Badges Distribution Card */}
        <div className="lg:col-span-4 glass-card p-6 flex flex-col justify-between space-y-4 hover-lift glow-card">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Badges Distribution</span>
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              {totalBadges} Total
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider block">Skill Badges</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400 block">{skillBadgesCount}</span>
            </div>

            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider block">Game Badges</span>
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400 block">{gameBadgesCount}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Row: Monthly Activity Heatmap & Season Prizes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Activity Heatmap Grid */}
        <div className="lg:col-span-6 glass-card p-6 hover-lift glow-card space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">Activity Calendar</h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                Arcade Season
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500 shrink-0">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 dark:text-white block font-heading">{totalBadges}</span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Total Earned Badges</span>
            </div>
          </div>

          {/* Activity Heatmap Blocks */}
          <div className="pt-2">
            <div className="grid grid-cols-7 gap-2 max-w-sm">
              {[...Array(28)].map((_, i) => {
                const isActive = i < Math.min(totalBadges, 28);
                return (
                  <div
                    key={i}
                    title={isActive ? `Badge activity logged` : `No activity logged`}
                    className={`h-5 rounded-md border transition-transform hover:scale-110 cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-500 border-emerald-600' 
                        : 'bg-slate-200/80 dark:bg-slate-800 border-slate-300/80 dark:border-slate-700'
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-slate-400 mt-3">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="w-2.5 h-2.5 rounded bg-emerald-400" />
              <div className="w-2.5 h-2.5 rounded bg-emerald-600" />
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Season Prizes & Swags Showcase */}
        <div className="lg:col-span-6 glass-card p-6 hover-lift glow-card space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">Season Prizes & Swags</h3>
            </div>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {swagTiers.map((tier, idx) => {
              const isUnlocked = totalPoints >= tier.requiredPts;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                    isUnlocked 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-800 dark:text-white' 
                      : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={tier.img} alt={tier.name} className="w-12 h-12 rounded-lg object-contain bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700" />
                    <div>
                      <h4 className="text-sm font-extrabold">{tier.name}</h4>
                      <p className="text-[10px] font-semibold text-slate-400">{tier.desc}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isUnlocked ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
                    }`}>
                      {isUnlocked ? 'Unlocked' : `${tier.requiredPts} PTS NEEDED`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Section: Badges Explorer & Live Filter */}
      {allBadgesList.length > 0 && (
        <div className="glass-card p-6 hover-lift glow-card space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
            <div>
              <h3 className="text-base font-extrabold text-slate-850 dark:text-white">Badges & Credentials Explorer</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Filter completed and missing Google Cloud Arcade badges</p>
            </div>

            {/* Search & Tabs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search badges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setBadgeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${badgeFilter === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  All ({allBadgesList.length})
                </button>
                <button
                  onClick={() => setBadgeFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${badgeFilter === 'completed' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setBadgeFilter('unearned')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${badgeFilter === 'unearned' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Incomplete
                </button>
              </div>
            </div>
          </div>

          {/* Badges Cards Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBadges.map((badge, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 flex items-start justify-between gap-3 hover:border-indigo-500/40 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">
                    {badge.category || badge.type}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug truncate mt-1">
                    {badge.title}
                  </h4>
                </div>

                {badge.earned !== false ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-350 dark:text-slate-700 shrink-0 mt-0.5" />
                )}
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

export default Dashboard;

