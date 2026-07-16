import React, { useEffect, useState } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { TableSkeleton } from '../components/SkeletonLoader';
import { Trash2, RefreshCw, Calendar, CheckCircle2, Award, Milestone, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert } from '../components/Alert';

export const History = () => {
  const { getAuthHeaders } = useAuth();
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recalcLoading, setRecalcLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [alertInfo, setAlertInfo] = useState(null);

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
        throw new Error('Failed to fetch calculation history');
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
    if (!window.confirm('Are you sure you want to delete this calculation from your history?')) {
      return;
    }
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
        setAlertInfo({ message: 'Calculation deleted successfully.', type: 'success' });
      } else {
        throw new Error(data.message || 'Failed to delete calculation');
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
          message: `Recalculation complete! Updated ${data.count} entries using current configuration.`,
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

  const getMilestoneStyle = (milestoneName) => {
    switch (milestoneName) {
      case 'Bronze Arcade':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border-amber-250 dark:border-amber-900/30';
      case 'Silver Arcade':
        return 'bg-slate-200 text-slate-800 dark:bg-slate-800/30 dark:text-slate-350 border-slate-300 dark:border-slate-800';
      case 'Gold Arcade':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400 border-yellow-250 dark:border-yellow-900/30';
      case 'Ultimate Arcade Champion':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400 border-purple-250 dark:border-purple-900/30';
      default:
        return 'bg-slate-100 text-slate-500 dark:bg-slate-900/30 dark:text-slate-500 border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Alert popup */}
      <AnimatePresence>
        {alertInfo && (
          <Alert message={alertInfo.message} type={alertInfo.type} onClose={() => setAlertInfo(null)} />
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Calculation History</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review and manage all your saved point evaluations.
          </p>
        </div>

        {calculations.length > 0 && (
          <button
            onClick={handleRecalculate}
            disabled={recalcLoading}
            className="flex items-center gap-2 py-2 px-4 rounded-xl border border-google-blue text-google-blue hover:bg-google-blue/5 font-semibold text-xs disabled:opacity-50 transition-all duration-300 shadow-sm"
          >
            {recalcLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            Recalculate History
          </button>
        )}
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : calculations.length > 0 ? (
        <div className="glass-card overflow-hidden">
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Labs Done</th>
                  <th className="py-4 px-6">Badges Done</th>
                  <th className="py-4 px-6">Points</th>
                  <th className="py-4 px-6">Milestone</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                {calculations.map((calc) => (
                  <tr key={calc._id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(calc.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-google-green" />
                        {calc.labsCount} Labs
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-google-yellow" />
                        {calc.badgesCount} Badges
                      </span>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-google-blue">
                      {calc.calculatedPoints} pts
                      <span className="block text-[9px] text-slate-400 font-normal">
                        ({calc.pointsConfig?.pointsPerLab || 1}L/{calc.pointsConfig?.pointsPerBadge || 2}B rates)
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getMilestoneStyle(calc.milestoneReached)}`}>
                        {calc.milestoneReached}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(calc._id)}
                        disabled={deleteLoadingId === calc._id}
                        className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 transition-colors"
                        title="Delete Record"
                      >
                        {deleteLoadingId === calc._id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile List View */}
          <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-800">
            {calculations.map((calc) => (
              <div key={calc._id} className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(calc.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-extrabold text-google-blue">
                      {calc.calculatedPoints} pts
                    </p>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${getMilestoneStyle(calc.milestoneReached)}`}>
                    {calc.milestoneReached}
                  </span>
                </div>

                <div className="flex gap-4 text-[11px] font-bold text-slate-600 dark:text-slate-350">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-google-green" />
                    {calc.labsCount} Labs
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-google-yellow" />
                    {calc.badgesCount} Badges
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[9px] text-slate-400">
                    Config: L:{calc.pointsConfig?.pointsPerLab || 1} / B:{calc.pointsConfig?.pointsPerBadge || 2}
                  </span>
                  <button
                    onClick={() => handleDelete(calc._id)}
                    disabled={deleteLoadingId === calc._id}
                    className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-500 font-bold text-[10px] transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        <div className="glass-card p-12 text-center text-slate-400 dark:text-slate-600 max-w-lg mx-auto">
          <Trophy className="w-16 h-16 stroke-1 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No History Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-6">
            You haven't saved any points calculations yet. Go use the calculator and save one to see it listed here!
          </p>
        </div>
      )}

    </div>
  );
};
