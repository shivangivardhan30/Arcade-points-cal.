import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, Calendar, Zap, PieChart as PieIcon } from 'lucide-react';

export const Analytics = () => {
  // Demo Data for Analytics graphs matching Google Cloud Arcade
  const weeklyData = [
    { name: 'Wk 1', Labs: 2, Badges: 1 },
    { name: 'Wk 2', Labs: 4, Badges: 2 },
    { name: 'Wk 3', Labs: 3, Badges: 3 },
    { name: 'Wk 4', Labs: 5, Badges: 2 },
    { name: 'Wk 5', Labs: 2, Badges: 3 },
    { name: 'Wk 6', Labs: 6, Badges: 4 }
  ];

  const pointsGrowth = [
    { date: 'Jun 01', Points: 10 },
    { date: 'Jun 10', Points: 15 },
    { date: 'Jun 20', Points: 22 },
    { date: 'Jun 30', Points: 28 },
    { date: 'Jul 10', Points: 35 },
    { date: 'Jul 18', Points: 42 }
  ];

  const badgeCategories = [
    { name: 'Skill Badges', value: 4, color: '#4285F4' },
    { name: 'Game Badges', value: 3, color: '#FBBC04' },
    { name: 'Milestone Badges', value: 3, color: '#34A853' },
    { name: 'Trivia Badges', value: 2, color: '#EA4335' }
  ];

  const stats = [
    { label: 'Weekly Active Rate', value: '88%', desc: 'Consistency score', Icon: Zap, colorClass: 'text-[#34A853]', bgClass: 'bg-[#34A853]/10' },
    { label: 'Badge Growth Velocity', value: '+3.2/mo', desc: 'Monthly average', Icon: TrendingUp, colorClass: 'text-[#4285F4]', bgClass: 'bg-[#4285F4]/10' },
    { label: 'Active Days / Wk', value: '4.8 Days', desc: 'Study schedule density', Icon: Calendar, colorClass: 'text-[#FBBC04]', bgClass: 'bg-[#FBBC04]/10' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-[#4285F4]/10 text-[#4285F4] rounded-2xl">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#E6EAF2]">Arcade Analytics</h1>
          <p className="text-xs text-[#94A3B8]">
            Track weekly study velocities, cumulative point trajectories, and badge category proportions.
          </p>
        </div>
      </div>

      {/* Grid statistics summaries */}
      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((item, idx) => {
          const { Icon, colorClass, bgClass } = item;
          return (
            <div key={idx} className="app-card p-5 flex items-center justify-between">
              <div className="space-y-1 font-bold">
                <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider">{item.label}</span>
                <h3 className="text-xl font-extrabold text-[#E6EAF2] mt-1">{item.value}</h3>
                <span className="text-[10px] text-[#94A3B8] block">{item.desc}</span>
              </div>
              <div className={`p-2.5 rounded-xl border border-[#1E2A44] ${bgClass}`}>
                <Icon className={`w-5 h-5 ${colorClass}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Weekly Progress Bar Chart */}
        <div className="app-card p-6 lg:col-span-2">
          <h3 className="text-xs font-extrabold text-[#E6EAF2] uppercase tracking-wider mb-5">
            Weekly Quests & Badges Completion Rate
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E2A44" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111A2E', borderColor: '#1E2A44', color: '#E6EAF2', fontSize: 11, borderRadius: 12 }} />
                <Bar dataKey="Labs" fill="#4285F4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Badges" fill="#FBBC04" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Proportions Pie Chart */}
        <div className="app-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-[#E6EAF2] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <PieIcon className="w-4 h-4 text-[#4285F4]" /> Badges Distribution
            </h3>
            <div className="h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={badgeCategories}
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {badgeCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111A2E', borderColor: '#1E2A44', color: '#E6EAF2', fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center space-y-0.5 pointer-events-none">
                <span className="text-[10px] text-[#94A3B8] font-bold block">TOTAL</span>
                <span className="text-base font-extrabold text-[#E6EAF2]">12 Badges</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-[#94A3B8]">
            {badgeCategories.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="truncate">{cat.name}: {cat.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Points growth Cumulative Area Chart */}
      <div className="app-card p-6">
        <h3 className="text-xs font-extrabold text-[#E6EAF2] uppercase tracking-wider mb-5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#34A853]" /> Cumulative Points Growth Over Time
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pointsGrowth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="pointsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4285F4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34A853" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E2A44" />
              <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#111A2E', borderColor: '#1E2A44', color: '#E6EAF2', fontSize: 11, borderRadius: 12 }} />
              <Area type="monotone" dataKey="Points" stroke="#4285F4" strokeWidth={2.5} fillOpacity={1} fill="url(#pointsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
export default Analytics;
