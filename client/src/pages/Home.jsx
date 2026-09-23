import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ProfileInput } from '../components/ProfileInput';
import { LoadingState } from '../components/LoadingState';
import { HeroSection } from '../components/HeroSection';
import { SummaryCards } from '../components/SummaryCards';
import { PointsBreakdown } from '../components/PointsBreakdown';
import { NextGoalCard } from '../components/NextGoalCard';
import { TierProgress } from '../components/TierProgress';
import { BadgeTracker } from '../components/BadgeTracker';
import { FacilitatorProgress } from '../components/FacilitatorProgress';
import { NextActions } from '../components/NextActions';
import { Timeline } from '../components/Timeline';
import { DevDebugPanel } from '../components/DevDebugPanel';
import { HowItWorks } from '../components/HowItWorks';
import { FAQ } from '../components/FAQ';
import { About } from '../components/About';
import { Footer } from '../components/Footer';

import { fetchProfileData } from '../services/profileService';
import { calculateArcadeMetrics } from '../services/calculatorService';
import { User, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState(null);

  const handleCalculate = async (profileUrl) => {
    setLoading(true);
    setError('');

    try {
      const profileData = await fetchProfileData(profileUrl);
      const calculatedMetrics = calculateArcadeMetrics(profileData);
      setMetrics(calculatedMetrics);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to retrieve profile data. Please check the URL and try again.');
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMetrics(null);
    setError('');
  };

  return (
    <div id="home" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      
      {/* Header Navigation */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* HERO INPUT SECTION */}
        <section className="text-center py-8 sm:py-16 space-y-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <Compass className="w-4 h-4 text-indigo-500" />
            <span>Google Cloud Arcade Community Tracker</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black font-heading text-slate-900 dark:text-white tracking-tight leading-[1.1]"
          >
            Arcade Points Calculator
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Track your Google Cloud Arcade progress, points, badges, milestones, and next goals in one place.
          </motion.p>

          {/* Calculator Input */}
          <div id="calculator" className="pt-4">
            <ProfileInput
              onCalculate={handleCalculate}
              loading={loading}
              error={error}
              setError={setError}
              onReset={handleReset}
              hasResults={!!metrics}
            />
          </div>
        </section>

        {/* LOADING STATE */}
        {loading && <LoadingState />}

        {/* RESULTS DASHBOARD */}
        <AnimatePresence>
          {metrics && !loading && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-10 pt-4"
            >
              {/* Top Hero Journey Banner */}
              <HeroSection
                metrics={metrics}
                onCalculateAgain={() => {
                  const el = document.querySelector('#calculator');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onReset={handleReset}
              />

              {/* 1. Summary Cards */}
              <SummaryCards metrics={metrics} />

              {/* 2. Points Breakdown & Next Goal Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PointsBreakdown metrics={metrics} />
                <NextGoalCard metrics={metrics} />
              </div>

              {/* 3. Tier Progress & Badge Tracker Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TierProgress metrics={metrics} />
                <BadgeTracker metrics={metrics} />
              </div>

              {/* 4. Facilitator Progress & What Should I Do Next */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FacilitatorProgress metrics={metrics} />
                <NextActions metrics={metrics} />
              </div>

              {/* 5. Achievement Timeline */}
              <Timeline metrics={metrics} />

            </motion.section>
          )}
        </AnimatePresence>

        {/* EMPTY STATE (Before calculation) */}
        {!metrics && !loading && (
          <div className="glass-card p-10 border border-slate-200/80 dark:border-slate-800 rounded-3xl text-center space-y-3 max-w-2xl mx-auto my-8 glow-card">
            <User className="w-10 h-10 text-indigo-500/60 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
              No Profile Evaluated Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Enter your Google Skills Boost profile URL above to see your Arcade progress, calculated points, and tier standings.
            </p>
          </div>
        )}

        {/* INFORMATION SECTIONS */}
        <HowItWorks />
        <FAQ />
        <About />

      </main>

      {/* Footer */}
      <Footer />

      {/* Dev-only Debug Panel */}
      <DevDebugPanel metrics={metrics} />

    </div>
  );
};

export default Home;

