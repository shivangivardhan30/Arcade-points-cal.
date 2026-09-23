import React from 'react';
import { ExternalLink, RefreshCw, RotateCcw, Compass, Trophy } from 'lucide-react';
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
    <div className="glass-card p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-6 hover-lift glow-card relative overflow-hidden">
      
      {/* Top Header Tag */}
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            YOUR ARCADE JOURNEY
          </span>
        </div>

        <div className="flex items-center gap-2">
          {profileUrl && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Profile</span>
            </a>
          )}
          <button
            onClick={onCalculateAgain}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1"
            title="Calculate Again"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Calculate Again</span>
          </button>
          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
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
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-500/10 border border-slate-200 dark:border-slate-800 shrink-0"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-brand text-white font-black text-2xl flex items-center justify-center shrink-0">
              {profileName.charAt(0)}
            </div>
          )}

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
              {profileName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Google Cloud Skills Boost • {memberSince}
            </p>
          </div>
        </div>

        {/* Center/Right: Points & Tier */}
        <div className="flex items-center gap-6 text-center md:text-right">
          
          {/* Big Score */}
          <div className="space-y-0.5">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400 font-heading"
            >
              {totalPoints}
            </motion.div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              POINTS
            </span>
          </div>

          {/* Current Tier Badge */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center min-w-[110px]">
            <Trophy className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block font-heading">
              {currentTier.name}
            </span>
            <span className="text-[10px] text-slate-400 font-bold block">Current Tier</span>
          </div>

        </div>

      </div>

      {/* Dynamic Progress Bar */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-500 dark:text-slate-400">
            {nextTier ? `${totalPoints} / ${nextTier.minPoints} Points` : `${totalPoints} Points`}
          </span>
          <span className="text-indigo-600 dark:text-indigo-400 font-black">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-3.5 overflow-hidden border border-slate-200 dark:border-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-gradient-brand h-full rounded-full"
          />
        </div>

        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 text-center pt-1">
          {nextTier
            ? `${pointsNeeded} points needed for ${nextTier.name}`
            : 'Congratulations! You have reached the highest currently configured tier.'}
        </p>
      </div>

    </div>
  );
};
