import React, { useEffect, useState } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { TableSkeleton } from '../components/SkeletonLoader';
import { Trash2, RefreshCw, Calendar, CheckCircle2, Award, Milestone, Shield, User, Moon, Sun, Printer, Search, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert } from '../components/Alert';

export const Settings = () => {
  const { user, getAuthHeaders } = useAuth();

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
        <div className="p-3 bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/20 rounded-2xl">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#E6EAF2]">Settings & Configurations</h1>
          <p className="text-xs text-[#94A3B8]">
            Customize display parameters, verify account credentials, and inspect logs history.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        
        {/* Left Side: General Profile and Display Settings */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* User Account Details */}
          <div className="app-card p-6 space-y-4">
            <h3 className="text-xs font-extrabold text-[#E6EAF2] uppercase tracking-wider">Account Credentials</h3>
            
            <div className="flex items-center gap-3.5 pb-4 border-b border-[#1E2A44]">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/20">
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 font-bold">
                <span className="text-xs text-[#E6EAF2] block">{user?.name || 'Shivangi Vardhan'}</span>
                <span className="text-[10px] text-[#94A3B8] block truncate">{user?.email || 'shivangi@cloudarc.io'}</span>
              </div>
            </div>

            <div className="text-[11px] font-semibold text-[#94A3B8] space-y-2">
              <div className="flex justify-between">
                <span>Account Role</span>
                <span className="text-[#4285F4] font-extrabold capitalize">{user?.role || 'user'}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-[#34A853] font-bold">Active</span>
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div className="app-card p-6 space-y-4">
            <h3 className="text-xs font-extrabold text-[#E6EAF2] uppercase tracking-wider">Display Options</h3>
            
            <div className="flex items-center justify-between py-2 border-b border-[#1E2A44]">
              <span className="text-xs font-bold text-[#E6EAF2]">Theme Mode</span>
              <span className="text-xs font-extrabold text-[#4285F4] bg-[#4285F4]/10 px-2.5 py-1 rounded-full border border-[#4285F4]/20">
                Dark (Google Brand Palette)
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-bold text-[#E6EAF2]">Export Report</span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 py-1.5 px-3 bg-[#4285F4] hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg shadow transition-all"
              >
                <Printer className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Saved History Lists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="app-card p-6 space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xs font-extrabold text-[#E6EAF2] uppercase tracking-wider">Saved Evaluation Logs</h3>
              
              {calculations.length > 0 && (
                <button
                  onClick={handleRecalculate}
                  disabled={recalcLoading}
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-[#4285F4]/10 text-[#4285F4] hover:bg-[#4285F4]/20 border border-[#4285F4]/20 rounded-xl font-bold text-[10px] disabled:opacity-50 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${recalcLoading ? 'animate-spin' : ''}`} />
                  Recalculate Multipliers
                </button>
              )}
            </div>

            {/* Search history input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search history by date, points, or milestone..."
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#1E2A44] bg-[#0B1220] rounded-xl text-[11px] font-semibold text-[#E6EAF2] placeholder:text-[#94A3B8] outline-none focus:border-[#4285F4] transition-all"
              />
            </div>

            {loading ? (
              <TableSkeleton rows={4} cols={5} />
            ) : filteredHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px] font-semibold">
                  <thead>
                    <tr className="bg-[#0B1220] text-[#94A3B8] border-b border-[#1E2A44] text-[9px] uppercase font-bold tracking-wider">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Labs/Badges</th>
                      <th className="py-3 px-4">Points</th>
                      <th className="py-3 px-4">Milestone</th>
                      <th className="py-3 px-4 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2A44] text-[#E6EAF2]">
                    {filteredHistory.map((calc) => (
                      <tr key={calc._id} className="hover:bg-[#0B1220]/50 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                          {new Date(calc.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#E6EAF2] font-bold">{calc.labsCount}L</span> / <span>{calc.badgesCount}B</span>
                        </td>
                        <td className="py-3 px-4 text-[#4285F4] font-bold">{calc.calculatedPoints} pts</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[9px] text-[#FBBC04] font-bold">
                            <Milestone className="w-3 h-3" /> {calc.milestoneReached}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDelete(calc._id)}
                            disabled={deleteLoadingId === calc._id}
                            className="p-1 rounded hover:bg-[#EA4335]/10 text-[#94A3B8] hover:text-[#EA4335] transition-colors"
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
              <div className="text-center py-8 text-[#94A3B8] font-bold text-xs">
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
