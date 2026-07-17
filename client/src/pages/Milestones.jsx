import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Milestone, Award, CheckCircle2, Circle, ArrowUpRight, Flame, Hourglass, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Milestones = () => {
  const { config, calculatePoints, getMilestoneReached, getNextMilestoneInfo } = useConfig();
  
  // Simulation states
  const [simLabs, setSimLabs] = useState(18);
  const [simBadges, setSimBadges] = useState(12);

  // Standard Arcade milestones list
  const milestoneList = [
    { name: 'Bronze Arcade', pointsRequired: 10, desc: 'Starting swag rewards eligibility', rewards: 'Arcade pin & stickers pack' },
    { name: 'Silver Arcade', pointsRequired: 25, desc: 'Standard rewards tier entry', rewards: 'Arcade bottle & notebook' },
    { name: 'Gold Arcade', pointsRequired: 50, desc: 'Advanced certificate badge rewards', rewards: 'Arcade T-shirt & cap' },
    { name: 'Ultimate Arcade Champion', pointsRequired: 80, desc: 'VIP swag catalog access', rewards: 'Arcade Hoodie & bag pack' }
  ];

  const currentPoints = calculatePoints(simLabs, simBadges);
  const activeMilestone = getMilestoneReached(currentPoints);
  const nextMilestone = getNextMilestoneInfo ? getNextMilestoneInfo(currentPoints) : {
    name: 'Gold Arcade',
    pointsNeeded: Math.max(0, 50 - currentPoints),
    labsNeeded: Math.max(0, 50 - currentPoints),
    badgesNeeded: Math.max(0, Math.ceil((50 - currentPoints) / 2)),
    progress: Math.min(100, Math.round((currentPoints / 50) * 100))
  };

  const getCompletionStatus = (pointsRequired) => {
    return currentPoints >= pointsRequired;
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 rounded-2xl">
          <Milestone className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-white">Milestones Tracker</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor badge tier requirements, track remaining points, and simulate milestone forecasts.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Milestones checklists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 hover-lift">
            <h2 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider mb-5">
              Arcade Tier Progression Checklists
            </h2>

            <div className="space-y-4">
              {milestoneList.map((m, idx) => {
                const isUnlocked = getCompletionStatus(m.pointsRequired);
                return (
                  <div
                    key={idx}
                    className={`flex items-start justify-between p-4 rounded-2xl border transition-all duration-300 ${
                      isUnlocked
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-800 dark:text-slate-200'
                        : 'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-850 text-slate-550 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {isUnlocked ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-350 dark:text-slate-700" />
                        )}
                      </div>
                      <div className="space-y-0.5 font-bold">
                        <span className={`text-xs ${isUnlocked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>
                          {m.name} ({m.pointsRequired} pts)
                        </span>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold leading-normal">{m.desc}</p>
                        <p className="text-[9px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wider mt-1">Est Swag: {m.rewards}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isUnlocked ? 'bg-emerald-500/10 text-emerald-550 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Mock Interactive points simulator */}
          <div className="glass-card p-6 hover-lift">
            <h2 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider mb-4">
              Interactive Milestone Simulator
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold leading-normal mb-5">
              Simulate completed labs or badges to inspect how they impact your estimated points and milestone tiers.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 text-xs font-bold text-slate-600 dark:text-slate-400">
              <div className="space-y-1.5">
                <label className="pl-0.5">Simulated Labs / Quests Completed</label>
                <input
                  type="number"
                  min="0"
                  value={simLabs}
                  onChange={(e) => setSimLabs(Math.max(0, parseInt(e.target.value) || 0))}
                  className="brand-input"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="pl-0.5">Simulated Skill Badges Completed</label>
                <input
                  type="number"
                  min="0"
                  value={simBadges}
                  onChange={(e) => setSimBadges(Math.max(0, parseInt(e.target.value) || 0))}
                  className="brand-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Statistics Panel */}
        <div className="space-y-6">
          
          {/* Active progress summary */}
          <div className="glass-card p-6 hover-lift space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-500 bg-indigo-500/5 px-2.5 py-0.5 rounded-md border border-indigo-500/10">
                Evaluation Tier
              </span>
              <h3 className="text-sm font-extrabold text-slate-850 dark:text-white uppercase tracking-wider mt-3">
                {activeMilestone !== 'None' ? activeMilestone : 'Bronze Candidate'}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">Active simulated points: <span className="font-extrabold text-indigo-550 dark:text-indigo-400">{currentPoints} pts</span></p>
            </div>

            {nextMilestone && nextMilestone.pointsNeeded > 0 ? (
              <div className="space-y-3 pt-4 border-t border-slate-200/50 dark:border-slate-850">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-450 uppercase tracking-wider text-[9px]">Progress to {nextMilestone.name}</span>
                  <span className="text-indigo-650 dark:text-indigo-400">{nextMilestone.progress}%</span>
                </div>
                
                <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-brand h-2.5 rounded-full" style={{ width: `${nextMilestone.progress}%` }} />
                </div>

                <div className="space-y-1 pt-1 text-[10px] font-semibold text-slate-450 leading-normal">
                  <p>Remaining points needed: <span className="font-bold text-slate-800 dark:text-slate-200">{nextMilestone.pointsNeeded} pts</span></p>
                  <p>Complete either <span className="font-bold text-slate-800 dark:text-slate-200">{nextMilestone.labsNeeded} Quests</span> OR <span className="font-bold text-slate-800 dark:text-slate-200">{nextMilestone.badgesNeeded} Skill Badges</span>.</p>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-200/50 dark:border-slate-850 text-center py-4">
                <Award className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <p className="font-extrabold text-slate-800 dark:text-white text-xs">Champion Status Unlocked!</p>
                <p className="text-[9px] text-slate-450 mt-1 font-semibold">You have simulated coordinates beyond all default milestones.</p>
              </div>
            )}
          </div>

          {/* Estimate Card */}
          <div className="glass-card p-6 hover-lift space-y-4">
            <h3 className="text-xs font-extrabold text-slate-855 dark:text-white uppercase tracking-wider">Completion Forecasts</h3>
            
            <div className="space-y-3 font-semibold text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/5 text-indigo-500 rounded-lg">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Weekly Velocity</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">2.5 badges / week</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/5 text-purple-500 rounded-lg">
                  <Hourglass className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Estimated Completion Date</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">August 15, 2026</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/5 text-pink-500 rounded-lg">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Pace Assessment</span>
                  <span className="font-bold text-emerald-500">On Track (Fast Pace)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default Milestones;
