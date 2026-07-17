import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, Calendar, Zap, PieChart as PieIcon, HelpCircle } from 'lucide-react';

export const Analytics = () => {
  
  // Premium Dummy Data for Analytics graphs
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
    { name: 'Generative AI', value: 4, color: '#3b82f6' },
    { name: 'Infrastructure', value: 3, color: '#6366f1' },
    { name: 'Application Dev', value: 3, color: '#a855f7' },
    { name: 'Security & Networks', value: 2, color: '#ec4899' }
  ];

  const stats = [
    { label: 'Weekly Active Rate', value: '88%', desc: 'Consistency score', Icon: Zap },
    { label: 'Badge Growth Velocity', value: '+3.2/mo', desc: 'Monthly average', Icon: TrendingUp },
    { label: 'Active Days / Wk', value: '4.8 Days', desc: 'Study schedule density', Icon: Calendar }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 rounded-2xl">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-white">CloudArc Pro Analytics</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track weekly study velocities, cumulative point trajectories, and badge category proportions.
          </p>
        </div>
      </div>

      {/* Grid statistics summaries */}
      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((item, idx) => {
          const { Icon } = item;
          return (
            <div key={idx} className="glass-card p-5 flex items-center justify-between hover-lift">
              <div className="space-y-1 font-bold">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider">{item.label}</span>
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">{item.value}</h3>
                <span className="text-[9px] text-slate-455 font-semibold block">{item.desc}</span>
              </div>
              <div className="p-2.5 bg-indigo-500/5 text-indigo-550 rounded-xl border border-indigo-500/5">
                <Icon className="w-4 h-4 text-indigo-500" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Weekly Progress Bar Chart */}
        <div className="glass-card p-6 lg:col-span-2 hover-lift">
          <h3 className="text-xs font-extrabold text-slate-855 dark:text-white uppercase tracking-wider mb-5">
            Weekly Quest & Badges Completion Rate
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-900" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                <Bar dataKey="Labs" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Badges" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Proportions Pie Chart */}
        <div className="glass-card p-6 hover-lift flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-slate-855 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <PieIcon className="w-4 h-4 text-indigo-500" /> Badges Distribution
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
                  <Tooltip contentStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center space-y-0.5 pointer-events-none">
                <span className="text-[10px] text-slate-400 font-bold block">TOTAL</span>
                <span className="text-base font-extrabold text-slate-800 dark:text-white">12 Badges</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-400">
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
      <div className="glass-card p-6 hover-lift">
        <h3 className="text-xs font-extrabold text-slate-855 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-500" /> Cumulative Points Growth Over Time
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pointsGrowth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="pointsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-900" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
              <Area type="monotone" dataKey="Points" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#pointsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
export default Analytics;
