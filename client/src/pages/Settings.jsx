import React, { useEffect, useState } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { TableSkeleton } from '../components/SkeletonLoader';
import { Trash2, RefreshCw, Calendar, CheckCircle2, Award, Milestone, Shield, User, Moon, Sun, Printer, Search, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert } from '../components/Alert';

export const Settings = () => {
  const { user, getAuthHeaders } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  // History logs states
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recalcLoading, setRecalcLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [alertInfo, setAlertInfo] = useState(null);
  const [searchHistory, setSearchHistory] = useState('');

  const fetchHistory = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch(`${API_URL}/calculations`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setCalculations(data);
      } else {
        throw new Error('Failed to load points history.');
      }
    } catch (err) {
      console.error(err);
      setAlertInfo({ message: err.message, type: 'error' });
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [getAuthHeaders]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this calculation from your logs?')) return;
    setDeleteLoadingId(id);
    setAlertInfo(null);
    try {
      const response = await fetch(`${API_URL}/calculations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (response.ok) {
        setCalculations(prev => prev.filter(c => c._id !== id));
        setAlertInfo({ message: 'History record removed successfully.', type: 'success' });
      } else {
        throw new Error(data.message || 'Failed to delete entry');
      }
    } catch (err) {
      setAlertInfo({ message: err.message, type: 'error' });
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleRecalculate = async () => {
    setRecalcLoading(true);
    setAlertInfo(null);
    try {
      const response = await fetch(`${API_URL}/calculations/recalculate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (response.ok) {
        setCalculations(data.data);
        setAlertInfo({
          message: `Recalculated! Synchronized ${data.count} records using current point multipliers.`,
          type: 'success'
        });
      } else {
        throw new Error(data.message || 'Recalculation failed');
      }
    } catch (err) {
      setAlertInfo({ message: err.message, type: 'error' });
    } finally {
      setRecalcLoading(false);
    }
  };

  const filteredHistory = calculations.filter((calc) => {
    const dateStr = new Date(calc.createdAt).toLocaleDateString().toLowerCase();
    const milestoneStr = calc.milestoneReached.toLowerCase();
    const pointsStr = calc.calculatedPoints.toString();
    const query = searchHistory.toLowerCase();
    return dateStr.includes(query) || milestoneStr.includes(query) || pointsStr.includes(query);
  });

  return (
    <div className="space-y-6">
      
      {/* Notifications toast */}
      <AnimatePresence>
        {alertInfo && (
          <Alert message={alertInfo.message} type={alertInfo.type} onClose={() => setAlertInfo(null)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 rounded-2xl">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-white">Settings & Configurations</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize display parameters, verify account credentials, and inspect logs history.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        
        {/* Left Side: General Profile and Theme Settings */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* User Account Details */}
          <div className="glass-card p-6 hover-lift space-y-4">
            <h3 className="text-xs font-extrabold text-slate-855 dark:text-white uppercase tracking-wider">Account Credentials</h3>
            
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200/50 dark:border-slate-850">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/5 text-indigo-500 border border-indigo-500/10">
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 font-bold">
                <span className="text-xs text-slate-800 dark:text-white block">{user?.name || 'Shivangi Vardhan'}</span>
                <span className="text-[10px] text-slate-450 block truncate">{user?.email || 'shivangi@cloudarc.io'}</span>
              </div>
            </div>

            <div className="text-[11px] font-semibold text-slate-550 dark:text-slate-450 space-y-2">
              <div className="flex justify-between">
                <span>Account Role</span>
                <span className="text-indigo-650 dark:text-indigo-400 font-extrabold capitalize">{user?.role || 'user'}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-emerald-500 font-bold">Active</span>
              </div>
            </div>
          </div>

          {/* Theme & Display Options */}
          <div className="glass-card p-6 hover-lift space-y-4">
            <h3 className="text-xs font-extrabold text-slate-855 dark:text-white uppercase tracking-wider">Display Preferences</h3>
            
            <div className="flex items-center justify-between py-2 border-b border-slate-200/50 dark:border-slate-850">
              <span className="text-xs font-bold text-slate-655 dark:text-slate-350">Dark Mode</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-indigo-400"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-bold text-slate-655 dark:text-slate-350">Export Report</span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 py-1.5 px-3 bg-gradient-brand text-white text-[10px] font-bold rounded-lg shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Saved History Lists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 hover-lift space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xs font-extrabold text-slate-855 dark:text-white uppercase tracking-wider">Saved Evaluation Logs</h3>
              
              {calculations.length > 0 && (
                <button
                  onClick={handleRecalculate}
                  disabled={recalcLoading}
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-indigo-500/5 text-indigo-500 hover:bg-indigo-500/10 border border-indigo-500/10 rounded-xl font-bold text-[10px] disabled:opacity-50 transition-all duration-300"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${recalcLoading ? 'animate-spin' : ''}`} />
                  Recalculate Multipliers
                </button>
              )}
            </div>

            {/* Search history input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-450" />
              <input
                type="text"
                placeholder="Search history by date, points, or milestone..."
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 rounded-xl text-[11px] font-semibold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {loading ? (
              <TableSkeleton rows={4} cols={5} />
            ) : filteredHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px] font-semibold">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-450 border-b border-slate-200 dark:border-slate-850 text-[9px] uppercase font-bold tracking-wider">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Labs/Badges</th>
                      <th className="py-3 px-4">Points</th>
                      <th className="py-3 px-4">Milestone</th>
                      <th className="py-3 px-4 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
                    {filteredHistory.map((calc) => (
                      <tr key={calc._id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/20">
                        <td className="py-3 px-4 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(calc.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-800 dark:text-slate-200 font-bold">{calc.labsCount}L</span> / <span>{calc.badgesCount}B</span>
                        </td>
                        <td className="py-3 px-4 text-indigo-650 dark:text-indigo-400 font-bold">{calc.calculatedPoints} pts</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[9px] text-pink-500 font-bold">
                            <Milestone className="w-3 h-3" /> {calc.milestoneReached}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDelete(calc._id)}
                            disabled={deleteLoadingId === calc._id}
                            className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-955/20 text-slate-400 hover:text-rose-500"
                          >
                            {deleteLoadingId === calc._id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-450 font-bold text-xs">
                No matching history logs found.
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
export default Settings;
