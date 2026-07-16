import React, { useState } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { Plus, Minus, Calculator as CalcIcon, Save, Award, CheckCircle2, ChevronRight, Trophy, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert } from '../components/Alert';

export const Calculator = () => {
  const { getAuthHeaders } = useAuth();
  const { config, calculatePoints, getMilestoneReached, getNextMilestoneInfo } = useConfig();
  const [labs, setLabs] = useState(0);
  const [badges, setBadges] = useState(0);
  const [saveLoading, setSaveLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  const incrementLabs = () => setLabs(prev => prev + 1);
  const decrementLabs = () => setLabs(prev => Math.max(0, prev - 1));
  const incrementBadges = () => setBadges(prev => prev + 1);
  const decrementBadges = () => setBadges(prev => Math.max(0, prev - 1));

  const totalPoints = calculatePoints(labs, badges);
  const milestone = getMilestoneReached(totalPoints);
  const nextInfo = getNextMilestoneInfo(totalPoints);

  const handleSave = async () => {
    setSaveLoading(true);
    setAlertInfo(null);
    try {
      const response = await fetch(`${API_URL}/calculations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          labsCount: labs,
          badgesCount: badges
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAlertInfo({ message: 'Calculation saved to your dashboard history!', type: 'success' });
      } else {
        throw new Error(data.message || 'Failed to save calculation');
      }
    } catch (err) {
      setAlertInfo({ message: err.message, type: 'error' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleReset = () => {
    setLabs(0);
    setBadges(0);
    setAlertInfo(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Alert popup */}
      <AnimatePresence>
        {alertInfo && (
          <Alert message={alertInfo.message} type={alertInfo.type} onClose={() => setAlertInfo(null)} />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-google-blue/10 dark:bg-google-blue/20 text-google-blue rounded-2xl">
          <CalcIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Arcade Points Calculator</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your progress to calculate points and check milestones.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        
        {/* Left Side: Inputs */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Card: Inputs */}
          <div className="glass-card p-6 space-y-6">
            
            {/* Labs Counter */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-google-green" />
                  Labs Completed
                </h3>
                <p className="text-[10px] text-slate-400">Worth {config?.pointsPerLab} pt each</p>
              </div>
              
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={decrementLabs}
                  className="p-2 rounded-xl bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="0"
                  value={labs}
                  onChange={(e) => setLabs(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-12 text-center font-extrabold bg-transparent text-slate-800 dark:text-white outline-none border-b-2 border-slate-350 dark:border-slate-700 focus:border-google-blue"
                />
                <button
                  type="button"
                  onClick={incrementLabs}
                  className="p-2 rounded-xl bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Badges Counter */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Award className="w-4 h-4 text-google-yellow" />
                  Skill Badges Completed
                </h3>
                <p className="text-[10px] text-slate-400">Worth {config?.pointsPerBadge} pts each</p>
              </div>
              
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={decrementBadges}
                  className="p-2 rounded-xl bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="0"
                  value={badges}
                  onChange={(e) => setBadges(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-12 text-center font-extrabold bg-transparent text-slate-800 dark:text-white outline-none border-b-2 border-slate-350 dark:border-slate-700 focus:border-google-blue"
                />
                <button
                  type="button"
                  onClick={incrementBadges}
                  className="p-2 rounded-xl bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-250 dark:border-slate-750 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                Clear
              </button>
              
              <button
                type="button"
                onClick={handleSave}
                disabled={saveLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-300"
              >
                {saveLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Progress
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Right Side: Points Calculation Breakdown Details */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="glass-card p-6 bg-slate-50/50 dark:bg-slate-900/40 space-y-6">
            <h2 className="text-sm font-bold text-slate-855 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
              Calculation Summary
            </h2>

            {/* Breakdown item list */}
            <div className="space-y-4 text-xs font-semibold">
              <div className="flex justify-between">
                <span className="text-slate-500">Labs Points ({labs} x {config?.pointsPerLab})</span>
                <span className="text-slate-800 dark:text-slate-200">{labs * (config?.pointsPerLab || 1)} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Badges Points ({badges} x {config?.pointsPerBadge})</span>
                <span className="text-slate-800 dark:text-slate-200">{badges * (config?.pointsPerBadge || 2)} pts</span>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-305">Total Earned Points</span>
                <span className="text-xl font-extrabold text-google-blue">{totalPoints} pts</span>
              </div>

              <div className="flex justify-between items-center py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl mt-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Milestone Achieved</span>
                <span className="text-xs font-bold text-google-red">{milestone}</span>
              </div>
            </div>

            {/* Target guidance to next milestone */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              {nextInfo.nextMilestone ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>PROGRESS TO NEXT TIER</span>
                    <span>{nextInfo.progress}%</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-google-blue to-google-green h-full rounded-full transition-all duration-300"
                      style={{ width: `${nextInfo.progress}%` }}
                    />
                  </div>
                  
                  <div className="p-3 bg-slate-100/50 dark:bg-slate-900/50 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                    <p className="font-bold text-slate-750 dark:text-slate-300">
                      Need {nextInfo.pointsNeeded} more points for <span className="text-google-blue">{nextInfo.nextMilestone.name}</span>
                    </p>
                    <p>Complete either:</p>
                    <div className="flex justify-between font-bold pt-1 text-slate-700 dark:text-slate-350">
                      <span>{nextInfo.labsNeeded} Labs</span>
                      <span>OR</span>
                      <span>{nextInfo.badgesNeeded} Badges</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 bg-google-yellow/10 dark:bg-google-yellow/5 border border-google-yellow/20 rounded-2xl">
                  <Trophy className="w-6 h-6 text-google-yellow mx-auto mb-2" />
                  <p className="text-[11px] font-bold text-slate-750 dark:text-slate-200">Ultimate Milestone Achieved!</p>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">You are an Arcade Champion</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
