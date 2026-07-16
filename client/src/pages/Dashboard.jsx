import React, { useEffect, useState } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { CardSkeleton, ChartSkeleton } from '../components/SkeletonLoader';
import { Award, CheckCircle2, Milestone, TrendingUp, Trophy, Volume2, CloudLightning, Download, Share2, Clipboard, ShieldAlert, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Alert } from '../components/Alert';

export const Dashboard = () => {
  const { user, getAuthHeaders } = useAuth();
  const { config, loading: configLoading, getNextMilestoneInfo } = useConfig();
  const [calculations, setCalculations] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alertInfo, setAlertInfo] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const headers = getAuthHeaders();
        const [calcRes, annRes] = await Promise.all([
          fetch(`${API_URL}/calculations`, { headers }),
          fetch(`${API_URL}/admin/announcements/active`, { headers })
        ]);

        if (calcRes.ok && annRes.ok) {
          const calcData = await calcRes.json();
          const annData = await annRes.json();
          setCalculations(calcData);
          setAnnouncements(annData);
        } else {
          throw new Error('Failed to load dashboard data');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getAuthHeaders]);

  if (loading || configLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2"><ChartSkeleton /></div>
          <div><ChartSkeleton /></div>
        </div>
      </div>
    );
  }

  // Current stats are based on the latest calculation
  const latestCalc = calculations[0] || {
    labsCount: 0,
    badgesCount: 0,
    calculatedPoints: 0,
    milestoneReached: 'None'
  };

  const nextMilestoneDetails = getNextMilestoneInfo(latestCalc.calculatedPoints);

  // Format calculation data for progression chart (oldest to newest)
  const chartData = [...calculations]
    .reverse()
    .map(c => ({
      date: new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      Points: c.calculatedPoints,
    }));

  // Pie chart points distribution data
  const labPointsTotal = latestCalc.labsCount * (config?.pointsPerLab || 1);
  const badgePointsTotal = latestCalc.badgesCount * (config?.pointsPerBadge || 2);
  const pieData = [
    { name: 'Labs Points', value: labPointsTotal },
    { name: 'Badges Points', value: badgePointsTotal }
  ];

  const PIE_COLORS = ['#34A853', '#FBBC05'];

  // Share Progress
  const handleShare = async () => {
    const text = `I have earned ${latestCalc.calculatedPoints} points and achieved the ${latestCalc.milestoneReached} tier on Google Cloud Arcade Progress Tracker! Join me on Points Calculator.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Google Cloud Arcade Progress',
          text: text,
          url: window.location.origin
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(text);
        setAlertInfo({ message: 'Progress details copied to clipboard! Share it anywhere.', type: 'success' });
      } catch (err) {
        setAlertInfo({ message: 'Unable to copy text.', type: 'error' });
      }
    }
  };

  // Export PDF (window print trigger)
  const handleExportPDF = () => {
    window.print();
  };

  // Milestone list to display unlocked achievement medals
  const getAchievements = () => {
    const milestoneNames = config?.milestones?.map(m => m.name) || [];
    const userMilestone = latestCalc.milestoneReached;
    
    // Determine which milestones are unlocked
    const milestonesList = [
      { name: 'Bronze Arcade', desc: 'Unlocked at 10 pts', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
      { name: 'Silver Arcade', desc: 'Unlocked at 25 pts', color: 'text-slate-500 bg-slate-50 dark:bg-slate-900/20' },
      { name: 'Gold Arcade', desc: 'Unlocked at 50 pts', color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' },
      { name: 'Ultimate Arcade Champion', desc: 'Unlocked at 80 pts', color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' }
    ];

    // Find the current milestone index
    const sortedMilestones = [...(config?.milestones || [])].sort((a,b) => a.pointsRequired - b.pointsRequired);
    const activeIndex = sortedMilestones.findIndex(m => m.name === userMilestone);

    return milestonesList.map((m, idx) => {
      const dbMilestone = sortedMilestones.find(sm => sm.name === m.name);
      const isUnlocked = dbMilestone && latestCalc.calculatedPoints >= dbMilestone.pointsRequired;
      
      return {
        ...m,
        isUnlocked
      };
    });
  };

  const achievements = getAchievements();

  return (
    <div className="space-y-6 print:p-0">
      
      {/* Alert popup notifications */}
      <AnimatePresence>
        {alertInfo && (
          <Alert message={alertInfo.message} type={alertInfo.type} onClose={() => setAlertInfo(null)} />
        )}
      </AnimatePresence>

      {/* Action panel & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-805 dark:text-white flex items-center gap-2">
            Welcome, {user?.name}!
            <Sparkles className="w-5 h-5 text-google-yellow animate-bounce" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor points details, print activity transcripts, and check achievement medals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          
          {/* Export PDF Button */}
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-google-blue text-white font-bold text-xs hover:bg-blue-600 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export Report
          </button>
        </div>
      </div>

      {/* User profile card */}
      <div className="glass-card p-6 bg-gradient-to-r from-google-blue/10 via-google-green/10 to-google-yellow/10 dark:from-google-blue/5 dark:to-google-green/5 dark:to-google-yellow/5 border border-google-blue/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[9px] uppercase tracking-wide font-extrabold text-google-blue">Arcade Profile status</span>
          <h2 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            {user?.name}
            {user?.role === 'admin' && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-google-red/10 text-google-red text-[8px] font-bold uppercase border border-google-red/10">
                <ShieldAlert className="w-2.5 h-2.5" /> Admin
              </span>
            )}
          </h2>
          <p className="text-[10px] text-slate-450">{user?.email}</p>
        </div>
        <div className="text-left sm:text-right font-semibold">
          <p className="text-[10px] text-slate-450 uppercase">Current Milestone reached</p>
          <p className="text-sm font-extrabold text-google-red mt-0.5">{latestCalc.milestoneReached}</p>
        </div>
      </div>

      {/* Stats Counters Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Points */}
        <div className="glass-card p-5 border-l-4 border-l-google-blue flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Points</p>
            <h3 className="text-2xl font-extrabold mt-1 text-slate-800 dark:text-white">{latestCalc.calculatedPoints}</h3>
            <p className="text-[9px] text-slate-400 mt-1">Based on latest calculator save</p>
          </div>
          <div className="p-3 bg-google-blue/10 text-google-blue rounded-xl"><Trophy className="w-5 h-5" /></div>
        </div>

        {/* Labs completed */}
        <div className="glass-card p-5 border-l-4 border-l-google-green flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Standard Quests</p>
            <h3 className="text-2xl font-extrabold mt-1 text-slate-800 dark:text-white">{latestCalc.labsCount}</h3>
            <p className="text-[9px] text-slate-400 mt-1">Multiplier: {config?.pointsPerLab} pt each</p>
          </div>
          <div className="p-3 bg-google-green/10 text-google-green rounded-xl"><CheckCircle2 className="w-5 h-5" /></div>
        </div>

        {/* Badges completed */}
        <div className="glass-card p-5 border-l-4 border-l-google-yellow flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Skill Badges</p>
            <h3 className="text-2xl font-extrabold mt-1 text-slate-800 dark:text-white">{latestCalc.badgesCount}</h3>
            <p className="text-[9px] text-slate-400 mt-1">Multiplier: {config?.pointsPerBadge} pts each</p>
          </div>
          <div className="p-3 bg-google-yellow/10 text-google-yellow rounded-xl"><Award className="w-5 h-5" /></div>
        </div>

        {/* Next Target Points */}
        <div className="glass-card p-5 border-l-4 border-l-google-red flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Next Milestone</p>
            {nextMilestoneDetails.nextMilestone ? (
              <>
                <h3 className="text-base font-extrabold mt-1 text-slate-800 dark:text-white truncate max-w-[130px]">
                  {nextMilestoneDetails.nextMilestone.name}
                </h3>
                <p className="text-[9px] text-slate-400 mt-1">Need {nextMilestoneDetails.pointsNeeded} more points</p>
              </>
            ) : (
              <>
                <h3 className="text-base font-extrabold mt-1 text-slate-800 dark:text-white">Champion!</h3>
                <p className="text-[9px] text-slate-400 mt-1">Reached highest tier</p>
              </>
            )}
          </div>
          <div className="p-3 bg-google-red/10 text-google-red rounded-xl"><Milestone className="w-5 h-5" /></div>
        </div>

      </div>

      {/* Double Visualization Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Line Chart: Progression history */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-xs font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5">
            <TrendingUp className="w-4.5 h-4.5 text-google-blue" />
            Points Progress History
          </h2>
          
          <div className="h-56">
            {calculations.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="progressionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4285F4" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4285F4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="Points" stroke="#4285F4" strokeWidth={2} fillOpacity={1} fill="url(#progressionGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">No progress logged yet.</div>
            )}
          </div>
        </div>

        {/* Pie Chart: Points distribution */}
        <div className="glass-card p-6">
          <h2 className="text-xs font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5">
            <Sparkles className="w-4.5 h-4.5 text-google-yellow" />
            Points Distribution (Labs vs Badges)
          </h2>

          <div className="h-56 flex flex-col justify-center">
            {latestCalc.calculatedPoints > 0 ? (
              <div className="relative h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs text-center px-4">
                No active points log to show distribution.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Progress detail bar & Medals */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Next Milestone target guide */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-850 dark:text-white mb-4">Milestone Progress</h2>
            
            {nextMilestoneDetails.nextMilestone ? (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-500">Target: {nextMilestoneDetails.nextMilestone.name}</span>
                  <span className="text-google-blue">{latestCalc.calculatedPoints} / {nextMilestoneDetails.nextMilestone.pointsRequired} pts</span>
                </div>
                
                {/* Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-google-blue to-google-green h-full rounded-full transition-all duration-300"
                    style={{ width: `${nextMilestoneDetails.progress}%` }}
                  />
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 mt-4">
                  <p className="font-bold text-slate-700 dark:text-slate-350">
                    Remaining points needed: <span className="font-extrabold text-google-blue">{nextMilestoneDetails.pointsNeeded}</span>
                  </p>
                  <p className="text-slate-400 text-[10px]">Earn them by completing:</p>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    <span>{nextMilestoneDetails.labsNeeded} Quests</span>
                    <span className="text-slate-400 font-normal">OR</span>
                    <span>{nextMilestoneDetails.badgesNeeded} Skill Badges</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Trophy className="w-10 h-10 text-google-yellow mx-auto mb-2" />
                <p className="font-bold text-slate-750 dark:text-white">Champion status active!</p>
                <p className="text-[10px] text-slate-400 mt-1">You have unlocked all current system milestones.</p>
              </div>
            )}
          </div>
        </div>

        {/* Achievement Medals panel */}
        <div className="glass-card p-6">
          <h2 className="text-xs font-bold text-slate-850 dark:text-white mb-4">Your Milestone Medals</h2>
          
          <div className="grid gap-3 sm:grid-cols-2">
            {achievements.map((a, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-all duration-300 ${
                  a.isUnlocked 
                    ? `${a.color} border-slate-250/20 shadow-sm` 
                    : 'bg-slate-100/30 dark:bg-slate-900/30 border-slate-200 dark:border-slate-850 opacity-40'
                }`}
              >
                <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 ${a.isUnlocked ? 'text-inherit' : 'text-slate-400'}`}>
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold truncate max-w-[120px]">{a.name}</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">{a.isUnlocked ? 'Achieved!' : a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent activity & Announcements feed */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Recent calculations logs */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-xs font-bold text-slate-850 dark:text-white mb-4">Recent Evaluations Activity</h2>
          
          {calculations.length > 0 ? (
            <div className="space-y-3">
              {calculations.slice(0, 3).map((c) => (
                <div key={c._id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-350">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800 dark:text-white">Logged evaluation</p>
                    <p className="text-[9px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-google-blue">{c.calculatedPoints} pts</p>
                    <p className="text-[9px] text-slate-400">{c.labsCount}L / {c.badgesCount}B</p>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Link to="/history" className="text-xs text-google-blue hover:underline font-bold block text-center">
                  View Full History Logs
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">No evaluations logged yet.</div>
          )}
        </div>

        {/* Notices */}
        <div className="glass-card p-6">
          <h2 className="text-xs font-bold text-slate-850 dark:text-white mb-4 flex items-center gap-1.5">
            <Volume2 className="w-4.5 h-4.5 text-google-red" />
            Arcade Announcements
          </h2>
          
          <div className="space-y-4 max-h-52 overflow-y-auto">
            {announcements.slice(0, 2).map((a) => (
              <div key={a._id} className="p-3 bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-805 rounded-xl">
                <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{a.title}</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal line-clamp-2">{a.content}</p>
              </div>
            ))}
            {announcements.length === 0 && (
              <p className="text-center text-slate-400 text-xs py-4">No active notices.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
export default Dashboard;
