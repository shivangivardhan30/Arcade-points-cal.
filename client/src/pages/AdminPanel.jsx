import React, { useEffect, useState } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { TableSkeleton, ListSkeleton, CardSkeleton } from '../components/SkeletonLoader';
import { ShieldAlert, Users, Volume2, Save, Trash2, CheckCircle2, UserCheck, BarChart3, Plus, ToggleLeft, ToggleRight, GraduationCap, LayoutGrid, Calendar, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert } from '../components/Alert';

export const AdminPanel = () => {
  const { getAuthHeaders, user: loggedInUser } = useAuth();
  const { config, refreshConfig } = useConfig();
  
  // Tab states: 'analytics' | 'points' | 'announcements' | 'resources' | 'users'
  const [activeTab, setActiveTab] = useState('analytics');

  // Loaders & Alert states
  const [loading, setLoading] = useState(true);
  const [alertInfo, setAlertInfo] = useState(null);

  // Stats & Tables Data
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [resources, setResources] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  // Config parameters
  const [labsVal, setLabsVal] = useState(1);
  const [badgesVal, setBadgesVal] = useState(2);
  const [milestones, setMilestones] = useState([]);
  const [configSaving, setConfigSaving] = useState(false);

  // New Announcement
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annActive, setAnnActive] = useState(true);
  const [annSaving, setAnnSaving] = useState(false);

  // New Resource
  const [resTitle, setResTitle] = useState('');
  const [resCategory, setResCategory] = useState('lab');
  const [resLink, setResLink] = useState('');
  const [resDesc, setResDesc] = useState('');
  const [resTags, setResTags] = useState('');
  const [resSaving, setResSaving] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [statsRes, usersRes, annRes, resRes, calcRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers }),
        fetch(`${API_URL}/admin/users`, { headers }),
        fetch(`${API_URL}/admin/announcements`, { headers }),
        fetch(`${API_URL}/resources`),
        fetch(`${API_URL}/calculations`, { headers }) // Shared calculation log list for mock charts
      ]);

      if (statsRes.ok && usersRes.ok && annRes.ok && resRes.ok && calcRes.ok) {
        setStats(await statsRes.json());
        setUsers(await usersRes.json());
        setAnnouncements(await annRes.json());
        setResources(await resRes.json());
        setActivityLogs(await calcRes.json());
      } else {
        throw new Error('Failed to retrieve system admin data');
      }
    } catch (err) {
      console.error(err);
      setAlertInfo({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [getAuthHeaders]);

  // Sync config defaults
  useEffect(() => {
    if (config) {
      setLabsVal(config.pointsPerLab);
      setBadgesVal(config.pointsPerBadge);
      setMilestones(config.milestones || []);
    }
  }, [config]);

  // Save Points Rules Config
  const handleConfigSubmit = async (e) => {
    e.preventDefault();
    setConfigSaving(true);
    setAlertInfo(null);
    try {
      const response = await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          pointsPerLab: labsVal,
          pointsPerBadge: badgesVal,
          milestones
        })
      });

      if (response.ok) {
        setAlertInfo({ message: 'System rules updated!', type: 'success' });
        refreshConfig();
      } else {
        throw new Error('Failed to update config');
      }
    } catch (err) {
      setAlertInfo({ message: err.message, type: 'error' });
    } finally {
      setConfigSaving(false);
    }
  };

  const handleMilestoneValueChange = (index, value) => {
    const updated = [...milestones];
    updated[index].pointsRequired = Math.max(0, parseInt(value) || 0);
    setMilestones(updated);
  };

  // Publish Announcement
  const handleAnnSubmit = async (e) => {
    e.preventDefault();
    setAnnSaving(true);
    setAlertInfo(null);
    try {
      const response = await fetch(`${API_URL}/admin/announcements`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: annTitle, content: annContent, active: annActive })
      });

      const data = await response.json();

      if (response.ok) {
        setAnnouncements(prev => [data, ...prev]);
        setAnnTitle('');
        setAnnContent('');
        setAlertInfo({ message: 'Announcement posted!', type: 'success' });
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setAlertInfo({ message: err.message, type: 'error' });
    } finally {
      setAnnSaving(false);
    }
  };

  const handleAnnToggle = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/admin/announcements/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ active: !currentStatus })
      });
      const data = await response.json();
      if (response.ok) {
        setAnnouncements(prev => prev.map(a => a._id === id ? { ...a, active: data.active } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnnDelete = async (id) => {
    if (!window.confirm('Delete announcement?')) return;
    try {
      const response = await fetch(`${API_URL}/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setAnnouncements(prev => prev.filter(a => a._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CRUD Learning Resources
  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    setResSaving(true);
    setAlertInfo(null);
    try {
      const parsedTags = resTags.split(',').map((t) => t.trim()).filter(Boolean);
      const response = await fetch(`${API_URL}/resources`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: resTitle,
          category: resCategory,
          link: resLink,
          description: resDesc,
          tags: parsedTags
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResources(prev => [data, ...prev]);
        setResTitle('');
        setResLink('');
        setResDesc('');
        setResTags('');
        setAlertInfo({ message: 'Learning resource uploaded!', type: 'success' });
      } else {
        throw new Error(data.message || 'Failed to create resource');
      }
    } catch (err) {
      setAlertInfo({ message: err.message, type: 'error' });
    } finally {
      setResSaving(false);
    }
  };

  const handleResourceDelete = async (id) => {
    if (!window.confirm('Remove this resource catalog entry?')) return;
    try {
      const response = await fetch(`${API_URL}/resources/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setResources(prev => prev.filter(r => r._id !== id));
        setAlertInfo({ message: 'Resource removed.', type: 'success' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete User account
  const handleUserDelete = async (id) => {
    if (!window.confirm('Wipe user and their evaluations?')) return;
    try {
      const response = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setUsers(prev => prev.filter(u => u._id !== id));
        fetchAdminData(); // Refresh stats
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Analytics helper data format
  const analyticsChartData = [...activityLogs]
    .reverse()
    .map(c => ({
      date: new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      Evaluations: 1
    }));

  // Group calculations by date to show aggregates in the analytics line chart
  const getAggregatedLogsData = () => {
    const counts = {};
    [...activityLogs].forEach((c) => {
      const dateStr = new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });
    return Object.keys(counts).map(date => ({
      date,
      Evaluations: counts[date]
    })).reverse();
  };

  const aggregatedLogs = getAggregatedLogsData();

  const menuTabs = [
    { id: 'analytics', label: 'Analytics Dashboard', Icon: BarChart3 },
    { id: 'points', label: 'Point Rules Config', Icon: ShieldAlert },
    { id: 'announcements', label: 'Announcements', Icon: Volume2 },
    { id: 'resources', label: 'Resources Catalog', Icon: GraduationCap },
    { id: 'users', label: 'User Administration', Icon: Users }
  ];

  return (
    <div className="space-y-6">
      
      {/* Alert toasts */}
      <AnimatePresence>
        {alertInfo && (
          <Alert message={alertInfo.message} type={alertInfo.type} onClose={() => setAlertInfo(null)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-[#EA4335]/10 text-[#EA4335] border border-[#EA4335]/20 rounded-2xl">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#E6EAF2]">Admin Management Center</h1>
          <p className="text-xs text-[#94A3B8]">
            Platform parameters control desk, community logs, and links resources catalog CRUD.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 items-start">
        
        {/* Navigation Sidebar tabs */}
        <div className="space-y-1 bg-[#111A2E] p-3 rounded-xl border border-[#1E2A44]">
          {menuTabs.map((tab) => {
            const { Icon } = tab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#4285F4] text-white shadow'
                    : 'text-[#94A3B8] hover:bg-[#0B1220] hover:text-[#E6EAF2]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3">
          
          {loading ? (
            <CardSkeleton />
          ) : (
            <AnimatePresence mode="wait">
              
              {/* ANALYTICS DASHBOARD */}
              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Grid summary */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="app-card p-5 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-[#94A3B8] font-bold uppercase">Total Users</span>
                        <h3 className="text-xl font-extrabold mt-1 text-[#E6EAF2]">{stats?.totalUsers}</h3>
                      </div>
                      <div className="p-2.5 bg-[#4285F4]/10 text-[#4285F4] rounded-lg"><Users className="w-4 h-4" /></div>
                    </div>
                    <div className="app-card p-5 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-[#94A3B8] font-bold uppercase">Total Evaluations</span>
                        <h3 className="text-xl font-extrabold mt-1 text-[#E6EAF2]">{stats?.totalCalculations}</h3>
                      </div>
                      <div className="p-2.5 bg-[#34A853]/10 text-[#34A853] rounded-lg"><Activity className="w-4 h-4" /></div>
                    </div>
                    <div className="app-card p-5 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-[#94A3B8] font-bold uppercase">Average Score</span>
                        <h3 className="text-xl font-extrabold mt-1 text-[#E6EAF2]">{stats?.averagePoints} pts</h3>
                      </div>
                      <div className="p-2.5 bg-[#FBBC04]/10 text-[#FBBC04] rounded-lg"><CheckCircle2 className="w-4 h-4" /></div>
                    </div>
                  </div>

                  {/* System growth Line Chart */}
                  <div className="app-card p-6">
                    <h2 className="text-xs font-bold text-[#E6EAF2] mb-4">Calculations Traffic (Evaluations count by dates)</h2>
                    <div className="h-56">
                      {aggregatedLogs.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={aggregatedLogs} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4285F4" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#4285F4" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="Evaluations" stroke="#4285F4" strokeWidth={2} fillOpacity={1} fill="url(#adminChartGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-center text-[#94A3B8] text-xs py-8">No evaluations logged yet.</p>
                      )}
                    </div>
                  </div>

                </motion.div>
              )}

              {/* POINTS CONFIG */}
              {activeTab === 'points' && (
                <motion.div
                  key="points"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="app-card p-6"
                >
                  <h2 className="text-xs font-bold text-[#E6EAF2] mb-4 pb-3 border-b border-[#1E2A44]">
                    Point multipliers and Milestones targets settings
                  </h2>

                  <form onSubmit={handleConfigSubmit} className="space-y-4 text-xs font-bold text-[#94A3B8]">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="pl-0.5 text-[#E6EAF2]">Points Per Lab</label>
                        <input
                          type="number"
                          min="0"
                          value={labsVal}
                          onChange={(e) => setLabsVal(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full px-3 py-2 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs font-bold text-[#E6EAF2] outline-none focus:border-[#4285F4]"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="pl-0.5 text-[#E6EAF2]">Points Per Skill Badge</label>
                        <input
                          type="number"
                          min="0"
                          value={badgesVal}
                          onChange={(e) => setBadgesVal(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full px-3 py-2 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs font-bold text-[#E6EAF2] outline-none focus:border-[#4285F4]"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-[#1E2A44]">
                      <span className="text-[10px] uppercase font-bold text-[#94A3B8]">Milestone thresholds (Arcade tiers)</span>
                      
                      <div className="space-y-3 mt-2">
                        {milestones.map((m, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-[#0B1220] border border-[#1E2A44] rounded-xl">
                            <span className="font-bold text-[#E6EAF2]">{m.name}</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                value={m.pointsRequired}
                                onChange={(e) => handleMilestoneValueChange(idx, e.target.value)}
                                className="w-16 py-1.5 text-center bg-[#111A2E] font-bold border border-[#1E2A44] rounded-lg outline-none text-[#E6EAF2]"
                              />
                              <span className="text-[#94A3B8]">pts</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={configSaving}
                      className="w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl bg-[#4285F4] hover:bg-blue-500 text-white font-bold transition-all shadow"
                    >
                      <Save className="w-4 h-4" />
                      Save System Config
                    </button>
                  </form>

                </motion.div>
              )}

              {/* ANNOUNCEMENTS */}
              {activeTab === 'announcements' && (
                <motion.div
                  key="announcements"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-6 sm:grid-cols-5"
                >
                  {/* Create Form */}
                  <div className="sm:col-span-2 app-card p-6 h-fit">
                    <h3 className="text-xs font-bold text-[#E6EAF2] mb-4">Publish Announcement Alert</h3>
                    
                    <form onSubmit={handleAnnSubmit} className="space-y-3 text-xs font-semibold">
                      <input
                        type="text"
                        placeholder="Notice Title"
                        value={annTitle}
                        onChange={(e) => setAnnTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs text-[#E6EAF2] placeholder:text-[#94A3B8] outline-none focus:border-[#4285F4]"
                        required
                      />
                      <textarea
                        placeholder="Announcement text..."
                        rows="3"
                        value={annContent}
                        onChange={(e) => setAnnContent(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs text-[#E6EAF2] placeholder:text-[#94A3B8] outline-none focus:border-[#4285F4] resize-none"
                        required
                      />
                      <div className="flex justify-between items-center">
                        <label className="flex items-center gap-1.5 text-[#94A3B8] select-none cursor-pointer">
                          <input
                            type="checkbox"
                            checked={annActive}
                            onChange={(e) => setAnnActive(e.target.checked)}
                            className="w-4 h-4 rounded text-[#4285F4] focus:ring-[#4285F4]"
                          />
                          Active
                        </label>
                        <button
                          type="submit"
                          disabled={annSaving || !annTitle || !annContent}
                          className="flex items-center gap-1 py-1.5 px-4 bg-[#EA4335] text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-all"
                        >
                          Publish
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List Feed */}
                  <div className="sm:col-span-3 app-card p-6 max-h-96 overflow-y-auto space-y-3">
                    <h3 className="text-xs font-bold text-[#E6EAF2] mb-4">Announcements History</h3>
                    
                    {announcements.map((ann) => (
                      <div key={ann._id} className="flex justify-between items-center p-3 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs font-semibold">
                        <div className="max-w-[70%] space-y-0.5">
                          <h4 className="font-bold text-[#E6EAF2] truncate">{ann.title}</h4>
                          <p className="text-[9px] text-[#94A3B8]">Published {new Date(ann.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAnnToggle(ann._id, ann.active)}
                            className="text-[#94A3B8] hover:text-[#E6EAF2]"
                          >
                            {ann.active ? <ToggleRight className="w-6 h-6 text-[#34A853]" /> : <ToggleLeft className="w-6 h-6 text-[#94A3B8]" />}
                          </button>
                          <button
                            onClick={() => handleAnnDelete(ann._id)}
                            className="p-1 rounded text-[#94A3B8] hover:text-[#EA4335] hover:bg-[#EA4335]/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* RESOURCES MANAGER */}
              {activeTab === 'resources' && (
                <motion.div
                  key="resources"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-6 sm:grid-cols-5"
                >
                  {/* Create Form */}
                  <div className="sm:col-span-2 app-card p-6 h-fit">
                    <h3 className="text-xs font-bold text-[#E6EAF2] mb-4">Add Guide/Tutorial resource</h3>
                    
                    <form onSubmit={handleResourceSubmit} className="space-y-3 text-xs font-semibold">
                      <input
                        type="text"
                        placeholder="Resource Title"
                        value={resTitle}
                        onChange={(e) => setResTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs text-[#E6EAF2] placeholder:text-[#94A3B8] outline-none focus:border-[#4285F4]"
                        required
                      />
                      
                      <select
                        value={resCategory}
                        onChange={(e) => setResCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs text-[#E6EAF2] outline-none focus:border-[#4285F4]"
                      >
                        <option value="lab">Hands-on Lab</option>
                        <option value="badge">Skill Badge Guide</option>
                        <option value="path">Learning Path</option>
                        <option value="video">Helpful Video</option>
                      </select>

                      <input
                        type="url"
                        placeholder="URL Link (https://...)"
                        value={resLink}
                        onChange={(e) => setResLink(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs text-[#E6EAF2] placeholder:text-[#94A3B8] outline-none focus:border-[#4285F4]"
                        required
                      />

                      <textarea
                        placeholder="Quick Description of the link..."
                        rows="2"
                        value={resDesc}
                        onChange={(e) => setResDesc(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs text-[#E6EAF2] placeholder:text-[#94A3B8] outline-none focus:border-[#4285F4] resize-none"
                      />

                      <input
                        type="text"
                        placeholder="Tags (comma-separated: e.g. Quickstart, Security)"
                        value={resTags}
                        onChange={(e) => setResTags(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs text-[#E6EAF2] placeholder:text-[#94A3B8] outline-none focus:border-[#4285F4]"
                      />

                      <button
                        type="submit"
                        disabled={resSaving || !resTitle || !resLink}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#4285F4] text-white font-bold shadow"
                      >
                        <Plus className="w-4 h-4" />
                        Create Resource link
                      </button>
                    </form>
                  </div>

                  {/* List View */}
                  <div className="sm:col-span-3 app-card p-6 max-h-96 overflow-y-auto space-y-3">
                    <h3 className="text-xs font-bold text-[#E6EAF2] mb-4">Resources Catalog</h3>
                    
                    {resources.map((res) => (
                      <div key={res._id} className="flex justify-between items-center p-3 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs font-semibold">
                        <div className="max-w-[75%] space-y-0.5">
                          <h4 className="font-bold text-[#E6EAF2] truncate">{res.title}</h4>
                          <span className="text-[8px] bg-[#111A2E] text-[#94A3B8] px-1.5 py-0.5 rounded uppercase font-bold border border-[#1E2A44]">
                            {res.category}
                          </span>
                        </div>
                        <button
                          onClick={() => handleResourceDelete(res._id)}
                          className="p-2 rounded-lg text-[#94A3B8] hover:text-[#EA4335] hover:bg-[#EA4335]/10"
                          title="Delete Catalog Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* USER ADMINISTRATION */}
              {activeTab === 'users' && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="app-card p-6"
                >
                  <h2 className="text-xs font-bold text-[#E6EAF2] mb-4 pb-3 border-b border-[#1E2A44]">
                    Platform User Logs ({users.length})
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#0B1220] text-[#94A3B8] border-b border-[#1E2A44] text-[10px] uppercase font-bold">
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Role</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E2A44] font-semibold text-[#E6EAF2]">
                        {users.map((u) => (
                          <tr key={u._id} className="hover:bg-[#0B1220]/50 transition-colors">
                            <td className="py-3 px-4 flex items-center gap-1.5">
                              {u.role === 'admin' ? (
                                <div className="p-1 bg-[#EA4335]/10 text-[#EA4335] rounded-md"><ShieldAlert className="w-3 h-3" /></div>
                              ) : (
                                <div className="p-1 bg-[#4285F4]/10 text-[#4285F4] rounded-md"><UserCheck className="w-3 h-3" /></div>
                              )}
                              {u.name}
                            </td>
                            <td className="py-3 px-4 font-medium text-[#94A3B8]">{u.email}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                u.role === 'admin' ? 'bg-[#EA4335]/10 text-[#EA4335]' : 'bg-[#4285F4]/10 text-[#4285F4]'
                              }`}>{u.role}</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleUserDelete(u._id)}
                                disabled={u._id === loggedInUser?._id}
                                className="p-1 text-[#94A3B8] hover:text-[#EA4335] disabled:opacity-30"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          )}

        </div>

      </div>

    </div>
  );
};
export default AdminPanel;
