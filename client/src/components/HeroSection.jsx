import React from 'react';
import { ExternalLink, RefreshCw, RotateCcw, Trophy } from 'lucide-react';

export const HeroSection = ({ metrics, onCalculateAgain, onReset }) => {
  if (!metrics) return null;

  const {
    profileName,
    avatar,
    memberSince,
    profileUrl,
    totalPoints,
    currentTier,
    nextTier,
    progressPercent,
    pointsNeeded
  } = metrics;

  return (
    <div className="app-card p-6 sm:p-8 space-y-6">
      
      {/* Top Header Tag */}
      <div className="flex items-center justify-between border-b border-[#1E2A44] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#4285F4]">
            YOUR ARCADE JOURNEY
          </span>
        </div>

        <div className="flex items-center gap-2">
          {profileUrl && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-[#94A3B8] hover:text-[#4285F4] transition-colors inline-flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#4285F4]" />
              <span className="hidden sm:inline">View Public Profile</span>
            </a>
          )}
          <button
            onClick={onCalculateAgain}
            className="p-2 rounded-xl bg-[#0B1220] hover:bg-[#1E2A44] border border-[#1E2A44] text-[#E6EAF2] text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Calculate Again"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#4285F4]" />
            <span className="hidden sm:inline">Calculate Again</span>
          </button>
          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-[#0B1220] hover:bg-[#1E2A44] border border-[#1E2A44] text-[#E6EAF2] text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Content: Avatar, Name, Score, Tier */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: User Profile */}
        <div className="flex items-center gap-4 text-center md:text-left">
          {avatar ? (
            <img
              src={avatar}
              alt={profileName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#4285F4]/30 border border-[#1E2A44] shrink-0"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#4285F4] text-white font-bold text-2xl flex items-center justify-center shrink-0">
              {profileName.charAt(0)}
            </div>
          )}

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[#E6EAF2]">
              {profileName}
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Google Cloud Skills Boost • {memberSince}
            </p>
          </div>
        </div>

        {/* Center/Right: Points & Tier */}
        <div className="flex items-center gap-6 text-center md:text-right">
          
          {/* Big Score Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#0B1220] border border-[#1E2A44] space-y-0.5 min-w-[130px]">
            <div className="text-4xl sm:text-5xl font-extrabold text-[#4285F4] tracking-tight">
              {totalPoints}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] block">
              POINTS
            </span>
          </div>

          {/* Current Tier Badge */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#FBBC04]/10 border border-[#FBBC04]/30 text-center min-w-[120px]">
            <Trophy className="w-6 h-6 text-[#FBBC04] mx-auto mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FBBC04] block">
              {currentTier.name}
            </span>
            <span className="text-[10px] text-[#94A3B8] font-medium block mt-0.5">Current Tier</span>
          </div>

        </div>

      </div>

      {/* Dynamic Progress Bar: blue-to-green gradient */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-[#94A3B8]">
            {nextTier ? `${totalPoints} / ${nextTier.minPoints} Points` : `${totalPoints} Points`}
          </span>
          <span className="text-[#34A853] font-bold">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-[#0B1220] rounded-full h-3 overflow-hidden border border-[#1E2A44] p-0.5">
          <div
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(to right, #4285F4, #34A853)'
            }}
            className="h-full rounded-full transition-all duration-500"
          />
        </div>

        <p className="text-xs font-medium text-[#94A3B8] text-center pt-1">
          {nextTier
            ? `${pointsNeeded} points needed for ${nextTier.name}`
            : 'Congratulations! You have reached Legend standing!'}
        </p>
      </div>

    </div>
  );
};

export default HeroSection;
