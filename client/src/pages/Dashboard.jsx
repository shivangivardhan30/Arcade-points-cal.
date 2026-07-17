import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, BookOpen, Clock, Activity, Shield, Share2, Printer, CheckCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { user } = useAuth();

  // Premium Dummy Data for Dashboard UI
  const profile = {
    name: user?.name || 'Shivangi Vardhan',
    email: user?.email || 'shivangi@cloudarc.io',
    memberSince: '2026',
    role: user?.role || 'Professional Member',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  };

  const stats = [
    { label: 'Arcade Points', value: '42', subtitle: 'Estimated credits', Icon: Award, color: 'text-indigo-500 bg-indigo-500/5' },
    { label: 'Labs Completed', value: '18', subtitle: 'Hands-on practice', Icon: Activity, color: 'text-blue-500 bg-blue-500/5' },
    { label: 'Skill Badges', value: '12', subtitle: 'Credential verifications', Icon: Shield, color: 'text-purple-500 bg-purple-500/5' },
    { label: 'Courses Completed', value: '8', subtitle: 'Learning tracks', Icon: BookOpen, color: 'text-pink-500 bg-pink-500/5' }
  ];

  const recentActivities = [
    { id: 1, action: 'Earned Skill Badge', item: 'Build and Secure Networks in Google Cloud', time: '2 hours ago', status: 'completed' },
    { id: 2, action: 'Completed Quest', item: 'Baseline: Infrastructure Lab Track', time: '1 day ago', status: 'completed' },
    { id: 3, action: 'Earned Skill Badge', item: 'Deploy and Manage Cloud Applications', time: '3 days ago', status: 'completed' },
    { id: 4, action: 'Calculated Progress', item: 'Profile scan evaluation saved to logs', time: '4 days ago', status: 'log' }
  ];

  // Circular progress config
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (0.75 * circumference); // 75% progress dummy

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-white">Workspace Analytics Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Welcome back, {profile.name}. Review your active certifications and tracking parameters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 py-2 px-4 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all shadow-sm">
            <Share2 className="w-4 h-4" /> Share Report
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 py-2 px-4 bg-gradient-brand text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition-all">
            <Printer className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Profile Card & Circular Progress */}
        <div className="glass-card p-6 flex flex-col justify-between hover-lift lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200/50 dark:border-slate-850">
            <img src={profile.avatar} alt="avatar" className="w-18 h-18 rounded-2xl object-cover ring-4 ring-indigo-500/10" />
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-550 dark:text-indigo-400 px-2.5 py-0.5 rounded-full">
                {profile.role}
              </span>
              <h2 className="text-base font-extrabold text-slate-850 dark:text-white mt-1.5">{profile.name}</h2>
              <p className="text-[10px] text-slate-400 font-semibold">User ID: {profile.email} • Member since {profile.memberSince}</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 pt-6">
            
            {/* Progress Bar metric */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-450 dark:text-slate-400 uppercase tracking-wider text-[10px]">Arcade milestone level</span>
                <span className="text-indigo-650 dark:text-indigo-400">75%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-200/30 dark:border-slate-800">
                <div className="bg-gradient-brand h-3 rounded-full" style={{ width: '75%' }} />
              </div>
              <p className="text-[9px] text-slate-400 font-semibold leading-normal">
                You are currently <span className="font-bold text-slate-700 dark:text-slate-200">8 points</span> away from reaching the Gold Arcade Milestone.
              </p>
            </div>

            {/* Circular Progress Ring */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-900/50">
              <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                <circle
                  stroke="#e2e8f0"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  className="dark:stroke-slate-800"
                />
                <circle
                  stroke="url(#radialGradient)"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={circumference + ' ' + circumference}
                  style={{ strokeDashoffset }}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  className="transition-all duration-1000 ease-in-out"
                />
                <defs>
                  <linearGradient id="radialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="space-y-0.5 font-bold">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Target completion</span>
                <span className="text-sm text-slate-800 dark:text-white block">12 / 16 Badges</span>
                <span className="text-[9px] text-emerald-500 flex items-center gap-0.5 mt-0.5"><TrendingUp className="w-3 h-3" /> +18% this month</span>
              </div>
            </div>

          </div>
        </div>

        {/* Milestone Quick Card */}
        <div className="glass-card p-6 flex flex-col justify-between hover-lift">
          <div className="space-y-2">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-500/5 border border-purple-500/10 px-2 py-0.5 rounded-md">
              Active Tier
            </span>
            <h3 className="text-sm font-extrabold text-slate-850 dark:text-white uppercase tracking-wider pt-2">Silver Arcade Level</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-semibold">
              You completed 18 hands-on cloud quests and 12 badge credentials. Your score places you in the top 10% of local arcade participants.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-850 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400">Next milestone:</span>
            <span className="text-indigo-650 dark:text-indigo-400 flex items-center gap-0.5">
              Gold Tier <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>

      </div>

      {/* Stats Counter Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const { Icon } = stat;
          return (
            <div key={idx} className="glass-card p-5 flex items-center justify-between hover-lift">
              <div className="space-y-1 font-bold">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{stat.value}</h3>
                <span className="text-[9px] text-slate-450 font-semibold block">{stat.subtitle}</span>
              </div>
              <div className={`p-3 rounded-2xl ${stat.color} border border-indigo-500/5`}>
                <Icon className="w-5 h-5 text-indigo-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Timeline list */}
      <div className="glass-card p-6 hover-lift">
        <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-500" /> Recent Activity Timeline
        </h3>
        
        <div className="flow-root">
          <ul className="-mb-8">
            {recentActivities.map((act, actIdx) => (
              <li key={act.id}>
                <div className="relative pb-8">
                  {actIdx !== recentActivities.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-slate-950 ${
                        act.status === 'completed' ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/20' : 'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/20'
                      }`}>
                        <CheckCircle className="w-4 h-4" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4 text-xs">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        <span className="font-extrabold text-slate-850 dark:text-white">{act.action}</span> - {act.item}
                      </div>
                      <div className="text-right text-[10px] text-slate-400 whitespace-nowrap font-medium">
                        {act.time}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};
export default Dashboard;
