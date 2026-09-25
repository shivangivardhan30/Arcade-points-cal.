import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { calculateArcadeMetrics } from '../services/calculatorService';
import { Search, CheckCircle2, Circle, Gift, Calendar, Trophy, Flame, User, ArrowRight } from 'lucide-react';
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
      <div className="app-card p-12 text-center space-y-5 max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-[#4285F4]/10 text-[#4285F4] flex items-center justify-center mx-auto border border-[#4285F4]/20">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-[#E6EAF2]">No Profile Analyzed Yet</h2>
          <p className="text-sm text-[#94A3B8] font-medium max-w-md mx-auto">
            Please analyze your Google Skills Boost profile first on the Home page to unlock full dashboard analytics and breakdown.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4285F4] hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow"
        >
          <span>Go to Calculator</span>
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
        <div className="lg:col-span-4 app-card p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#4285F4]/20 border border-[#1E2A44] shrink-0"
            />
            <div className="space-y-1 min-w-0">
              <h2 className="text-xl font-black text-[#E6EAF2] truncate">{profileName}</h2>
              <p className="text-xs text-[#94A3B8] font-semibold">{memberSince}</p>
              
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FBBC04] bg-[#FBBC04]/10 border border-[#FBBC04]/20 px-2.5 py-0.5 rounded-md mt-1">
                <Trophy className="w-3.5 h-3.5 text-[#FBBC04]" />
                <span className="uppercase tracking-wider font-mono text-[10px]">{currentTier.name} Standing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Arcade Points Card */}
        <div className="lg:col-span-4 app-card p-6 flex flex-col justify-between space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#94A3B8]">Total Arcade Points</span>
          
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-[#4285F4]">
              {totalPoints}
            </span>
            <span className="text-xl font-bold text-[#E6EAF2]">Pts</span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-[#E6EAF2] bg-[#34A853]/10 border border-[#34A853]/20 px-3 py-1 rounded-lg w-fit font-semibold">
            <span>Includes <strong className="text-[#34A853] font-extrabold">+{bonusPoints} bonus pts</strong></span>
          </div>
        </div>

        {/* Badges Distribution Card */}
        <div className="lg:col-span-4 app-card p-6 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#94A3B8]">Badges Distribution</span>
            <span className="text-xs font-extrabold text-[#E6EAF2] bg-[#0B1220] px-2.5 py-1 rounded-full border border-[#1E2A44]">
              {totalBadges} Total
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 bg-[#4285F4]/10 border border-[#4285F4]/20 rounded-xl space-y-1">
              <span className="text-[10px] text-[#94A3B8] font-extrabold uppercase tracking-wider block">Skill Badges</span>
              <span className="text-2xl font-black text-[#4285F4] block">{skillBadgesCount}</span>
            </div>

            <div className="p-3.5 bg-[#FBBC04]/10 border border-[#FBBC04]/20 rounded-xl space-y-1">
              <span className="text-[10px] text-[#94A3B8] font-extrabold uppercase tracking-wider block">Game Badges</span>
              <span className="text-2xl font-black text-[#FBBC04] block">{gameBadgesCount}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Row: Monthly Activity Heatmap & Season Prizes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Activity Heatmap Grid */}
        <div className="lg:col-span-6 app-card p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#1E2A44]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#4285F4]" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E6EAF2]">Activity Calendar</h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#E6EAF2] bg-[#0B1220] px-2.5 py-1 rounded-full border border-[#1E2A44]">
                Arcade Season
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#FBBC04]/10 border border-[#FBBC04]/20 rounded-2xl text-[#FBBC04] shrink-0">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <span className="text-3xl font-black text-[#E6EAF2] block">{totalBadges}</span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#94A3B8] block">Total Earned Badges</span>
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
                        ? 'bg-[#34A853] border-[#34A853]' 
                        : 'bg-[#0B1220] border-[#1E2A44]'
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-[#94A3B8] mt-3">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded bg-[#0B1220]" />
              <div className="w-2.5 h-2.5 rounded bg-[#34A853]" />
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Season Prizes & Swags Showcase */}
        <div className="lg:col-span-6 app-card p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#1E2A44]">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#4285F4]" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E6EAF2]">Season Prizes & Swags</h3>
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
                      ? 'bg-[#34A853]/10 border-[#34A853]/30 text-[#E6EAF2]' 
                      : 'bg-[#0B1220] border-[#1E2A44] text-[#94A3B8]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={tier.img} alt={tier.name} className="w-12 h-12 rounded-lg object-contain bg-[#0B1220] p-1 border border-[#1E2A44]" />
                    <div>
                      <h4 className="text-sm font-extrabold text-[#E6EAF2]">{tier.name}</h4>
                      <p className="text-[10px] font-semibold text-[#94A3B8]">{tier.desc}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isUnlocked ? 'bg-[#34A853] text-white' : 'bg-[#4285F4] text-white'
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
        <div className="app-card p-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#1E2A44]">
            <div>
              <h3 className="text-base font-extrabold text-[#E6EAF2]">Badges & Credentials Explorer</h3>
              <p className="text-xs text-[#94A3B8] font-semibold mt-0.5">Filter completed and missing Google Cloud Arcade badges</p>
            </div>

            {/* Search & Tabs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search badges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs font-semibold text-[#E6EAF2] outline-none focus:border-[#4285F4]"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#0B1220] p-1 rounded-xl border border-[#1E2A44] text-xs font-bold">
                <button
                  onClick={() => setBadgeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${badgeFilter === 'all' ? 'bg-[#4285F4] text-white shadow' : 'text-[#94A3B8]'}`}
                >
                  All ({allBadgesList.length})
                </button>
                <button
                  onClick={() => setBadgeFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${badgeFilter === 'completed' ? 'bg-[#4285F4] text-white shadow' : 'text-[#94A3B8]'}`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setBadgeFilter('unearned')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${badgeFilter === 'unearned' ? 'bg-[#4285F4] text-white shadow' : 'text-[#94A3B8]'}`}
                >
                  Incomplete
                </button>
              </div>
            </div>
          </div>

          {/* Badges Cards Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBadges.map((badge, idx) => {
              const isCompleted = badge.earned !== false;
              const isSkill = (badge.category || badge.type || '').toLowerCase().includes('skill');
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
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
                      {badge.category || badge.type}
                    </span>
                    <h4 className="text-xs font-bold text-[#E6EAF2] leading-snug truncate mt-1">
                      {badge.title}
                    </h4>
                  </div>

                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-[#34A853] shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#EA4335] shrink-0 mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};

export default Dashboard;
