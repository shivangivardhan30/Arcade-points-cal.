import React from 'react';
import { ExternalLink, RefreshCw, RotateCcw, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="glass-card p-6 sm:p-8 border border-[#123a63] bg-gradient-to-b from-[#07111f] to-[#050b14] rounded-3xl space-y-6 hover-lift glow-card relative overflow-hidden shadow-2xl">
      
      {/* Top Header Tag */}
      <div className="flex items-center justify-between border-b border-[#123a63]/50 pb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-blue-400">
            YOUR ARCADE JOURNEY
          </span>
        </div>

        <div className="flex items-center gap-2">
          {profileUrl && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-slate-300 hover:text-blue-400 transition-colors inline-flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">View Public Profile</span>
            </a>
          )}
          <button
            onClick={onCalculateAgain}
            className="p-2.5 rounded-xl bg-[#0b1f33] hover:bg-[#123a63] border border-[#123a63] text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Calculate Again"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Calculate Again</span>
          </button>
          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-[#0b1f33] hover:bg-[#123a63] border border-[#123a63] text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
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
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-blue-500/20 border border-[#123a63] shrink-0 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-white font-black text-2xl flex items-center justify-center shrink-0 border border-blue-500/30">
              {profileName.charAt(0)}
            </div>
          )}

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {profileName}
            </h2>
            <p className="text-xs text-slate-400 font-semibold">
              Google Cloud Skills Boost • {memberSince}
            </p>
          </div>
        </div>

        {/* Center/Right: Points & Tier */}
        <div className="flex items-center gap-6 text-center md:text-right">
          
          {/* Big Score Glass Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0b1f33]/90 border border-[#123a63] space-y-0.5 shadow-inner min-w-[130px]">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-4xl sm:text-5xl font-black text-blue-400 font-heading tracking-tight"
            >
              {totalPoints}
            </motion.div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              POINTS
            </span>
          </div>

          {/* Current Tier Badge */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center min-w-[120px]">
            <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <span className="text-xs font-black uppercase tracking-wider text-blue-300 block font-heading">
              {currentTier.name}
            </span>
            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Current Tier</span>
          </div>

        </div>

      </div>

      {/* Dynamic Progress Bar */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-400">
            {nextTier ? `${totalPoints} / ${nextTier.minPoints} Points` : `${totalPoints} Points`}
          </span>
          <span className="text-blue-400 font-black">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-[#0b1f33] rounded-full h-3.5 overflow-hidden border border-[#123a63]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-400 h-full rounded-full shadow-lg shadow-blue-500/30"
          />
        </div>

        <p className="text-xs font-bold text-slate-300 text-center pt-1">
          {nextTier
            ? `${pointsNeeded} points needed for ${nextTier.name}`
            : 'Congratulations! You have reached Legend standing!'}
        </p>
      </div>

    </div>
  );
};

export default HeroSection;
