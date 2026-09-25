import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Milestone, Award, CheckCircle2, Circle, ArrowUpRight, Flame, Hourglass, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Milestones = () => {
  const { config, calculatePoints, getMilestoneReached, getNextMilestoneInfo } = useConfig();
  
  // Read active profile from localStorage if exists
  const getSavedProfileCounts = () => {
    try {
      const saved = localStorage.getItem('active_arcade_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.metrics) {
          return {
            labs: parsed.metrics.gameBadgesCount || 0,
            badges: parsed.metrics.skillBadgesCount || 0
          };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return { labs: 18, badges: 12 };
  };

  const initialCounts = getSavedProfileCounts();
  // Simulation states
  const [simLabs, setSimLabs] = useState(initialCounts.labs);
  const [simBadges, setSimBadges] = useState(initialCounts.badges);

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
        <div className="p-3 bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/20 rounded-2xl">
          <Milestone className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#E6EAF2]">Milestones Tracker</h1>
          <p className="text-xs text-[#94A3B8]">
            Monitor badge tier requirements, track remaining points, and simulate milestone forecasts.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Milestones checklists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="app-card p-6">
            <h2 className="text-xs font-extrabold text-[#E6EAF2] uppercase tracking-wider mb-5">
              Arcade Tier Progression Checklists
            </h2>

            <div className="space-y-4">
              {milestoneList.map((m, idx) => {
                const isUnlocked = getCompletionStatus(m.pointsRequired);
                return (
                  <div
                    key={idx}
                    className={`flex items-start justify-between p-4 rounded-xl border transition-all duration-300 ${
                      isUnlocked
                        ? 'bg-[#34A853]/10 border-[#34A853]/30 text-[#E6EAF2]'
                        : 'bg-[#0B1220] border-[#1E2A44] text-[#94A3B8]'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {isUnlocked ? (
                          <CheckCircle2 className="w-5 h-5 text-[#34A853]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#94A3B8]" />
                        )}
                      </div>
                      <div className="space-y-0.5 font-bold">
                        <span className={`text-xs ${isUnlocked ? 'text-[#34A853]' : 'text-[#E6EAF2]'}`}>
                          {m.name} ({m.pointsRequired} pts)
                        </span>
                        <p className="text-[10px] text-[#94A3B8] font-semibold leading-normal">{m.desc}</p>
                        <p className="text-[9px] text-[#4285F4] font-bold uppercase tracking-wider mt-1">Est Swag: {m.rewards}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isUnlocked ? 'bg-[#34A853]/20 text-[#34A853]' : 'bg-[#0B1220] text-[#94A3B8]'
                    }`}>
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Mock Interactive points simulator */}
          <div className="app-card p-6">
            <h2 className="text-xs font-extrabold text-[#E6EAF2] uppercase tracking-wider mb-4">
              Interactive Milestone Simulator
            </h2>
            <p className="text-[10px] text-[#94A3B8] font-semibold leading-normal mb-5">
              Simulate completed labs or badges to inspect how they impact your estimated points and milestone tiers.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 text-xs font-bold text-[#94A3B8]">
              <div className="space-y-1.5">
                <label className="pl-0.5">Simulated Labs / Quests Completed</label>
                <input
                  type="number"
                  min="0"
                  value={simLabs}
                  onChange={(e) => setSimLabs(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs font-bold text-[#E6EAF2] outline-none focus:border-[#4285F4]"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="pl-0.5">Simulated Skill Badges Completed</label>
                <input
                  type="number"
                  min="0"
                  value={simBadges}
                  onChange={(e) => setSimBadges(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs font-bold text-[#E6EAF2] outline-none focus:border-[#4285F4]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Statistics Panel */}
        <div className="space-y-6">
          
          {/* Active progress summary */}
          <div className="app-card p-6 space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#4285F4] bg-[#4285F4]/10 px-2.5 py-0.5 rounded-md border border-[#4285F4]/20">
                Evaluation Tier
              </span>
              <h3 className="text-sm font-extrabold text-[#E6EAF2] uppercase tracking-wider mt-3">
                {activeMilestone !== 'None' ? activeMilestone : 'Bronze Candidate'}
              </h3>
              <p className="text-[10px] text-[#94A3B8] font-semibold">Active simulated points: <span className="font-extrabold text-[#4285F4]">{currentPoints} pts</span></p>
            </div>

            {nextMilestone && nextMilestone.pointsNeeded > 0 ? (
              <div className="space-y-3 pt-4 border-t border-[#1E2A44]">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[#94A3B8] uppercase tracking-wider text-[9px]">Progress to {nextMilestone.name}</span>
                  <span className="text-[#4285F4]">{nextMilestone.progress}%</span>
                </div>
                
                <div className="w-full bg-[#0B1220] rounded-full h-2.5 overflow-hidden border border-[#1E2A44]">
                  <div className="bg-gradient-to-r from-[#4285F4] to-[#34A853] h-2.5 rounded-full" style={{ width: `${nextMilestone.progress}%` }} />
                </div>

                <div className="space-y-1 pt-1 text-[10px] font-semibold text-[#94A3B8] leading-normal">
                  <p>Remaining points needed: <span className="font-bold text-[#E6EAF2]">{nextMilestone.pointsNeeded} pts</span></p>
                  <p>Complete either <span className="font-bold text-[#E6EAF2]">{nextMilestone.labsNeeded} Quests</span> OR <span className="font-bold text-[#E6EAF2]">{nextMilestone.badgesNeeded} Skill Badges</span>.</p>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-[#1E2A44] text-center py-4">
                <Award className="w-10 h-10 text-[#FBBC04] mx-auto mb-2" />
                <p className="font-extrabold text-[#E6EAF2] text-xs">Champion Status Unlocked!</p>
                <p className="text-[9px] text-[#94A3B8] mt-1 font-semibold">You have simulated coordinates beyond all default milestones.</p>
              </div>
            )}
          </div>

          {/* Estimate Card */}
          <div className="app-card p-6 space-y-4">
            <h3 className="text-xs font-extrabold text-[#E6EAF2] uppercase tracking-wider">Completion Forecasts</h3>
            
            <div className="space-y-3 font-semibold text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/20 rounded-lg">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] text-[#94A3B8] block uppercase tracking-wider">Weekly Velocity</span>
                  <span className="font-bold text-[#E6EAF2]">2.5 badges / week</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FBBC04]/10 text-[#FBBC04] border border-[#FBBC04]/20 rounded-lg">
                  <Hourglass className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] text-[#94A3B8] block uppercase tracking-wider">Estimated Completion Date</span>
                  <span className="font-bold text-[#E6EAF2]">August 15, 2026</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#34A853]/10 text-[#34A853] border border-[#34A853]/20 rounded-lg">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] text-[#94A3B8] block uppercase tracking-wider">Pace Assessment</span>
                  <span className="font-bold text-[#34A853]">On Track (Fast Pace)</span>
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
