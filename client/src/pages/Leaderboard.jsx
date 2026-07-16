import React, { useEffect, useState } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { TableSkeleton } from '../components/SkeletonLoader';
import { Trophy, Search, Filter, Calendar, Award, CheckCircle2, Milestone } from 'lucide-react';
import { motion } from 'framer-motion';

export const Leaderboard = () => {
  const { getAuthHeaders } = useAuth();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterMilestone, setFilterMilestone] = useState('all');

  const fetchRankings = async () => {
    setLoading(true);
    try {
      // Leaderboard is public, so no auth headers are strictly required, 
      // but we support auth tokens if they exist to keep it secure
      const token = localStorage.getItem('arcade_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await fetch(`${API_URL}/leaderboard?search=${search}`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setRankings(data);
      } else {
        throw new Error('Failed to load leaderboard rankings');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search fetching
    const timer = setTimeout(() => {
      fetchRankings();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const getRankMedal = (rank) => {
    switch (rank) {
      case 1:
        return {
          bg: 'bg-yellow-100 text-yellow-800 border-yellow-250 dark:bg-yellow-950/30 dark:text-yellow-450 dark:border-yellow-900/30',
          text: '🥇 Gold'
        };
      case 2:
        return {
          bg: 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800/30 dark:text-slate-350 dark:border-slate-800',
          text: '🥈 Silver'
        };
      case 3:
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-250 dark:bg-amber-950/30 dark:text-amber-450 dark:border-amber-900/30',
          text: '🥉 Bronze'
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900/30 dark:text-slate-550 dark:border-slate-800',
          text: `#${rank}`
        };
    }
  };

  // Filter rankings by milestone on the client side for instant reaction
  const filteredRankings = rankings.filter(r => {
    if (filterMilestone === 'all') return true;
    return r.milestoneReached === filterMilestone;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-google-yellow/10 dark:bg-google-yellow/20 text-google-yellow rounded-2xl">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Arcade Leaderboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare and trace points progress with other community learners.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white/60 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
        
        {/* Search */}
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-450" />
          <input
            type="text"
            placeholder="Search by participant name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all"
          />
        </div>

        {/* Milestone Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-450 shrink-0" />
          <select
            value={filterMilestone}
            onChange={(e) => setFilterMilestone(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-google-blue transition-all text-slate-650 dark:text-slate-300 font-semibold"
          >
            <option value="all">All Milestones</option>
            <option value="Bronze Arcade">Bronze Arcade</option>
            <option value="Silver Arcade">Silver Arcade</option>
            <option value="Gold Arcade">Gold Arcade</option>
            <option value="Ultimate Arcade Champion">Ultimate Arcade Champion</option>
            <option value="None">No Milestone</option>
          </select>
        </div>

      </div>

      {/* Leaderboard Table list */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : filteredRankings.length > 0 ? (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-4 px-6">Rank</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Labs Done</th>
                  <th className="py-4 px-6">Badges Done</th>
                  <th className="py-4 px-6">Score</th>
                  <th className="py-4 px-6">Milestone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-350">
                {filteredRankings.map((row, idx) => {
                  const rank = idx + 1;
                  const medal = getRankMedal(rank);
                  return (
                    <motion.tr
                      key={row._id || idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/30 dark:hover:bg-slate-900/20 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${medal.bg}`}>
                          {medal.text}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        {row.name}
                        {row.role === 'admin' && (
                          <span className="text-[8px] font-bold bg-google-red/10 text-google-red px-1.5 py-0.5 rounded uppercase">Staff</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-google-green" />
                          {row.labsCount}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-google-yellow" />
                          {row.badgesCount}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-extrabold text-google-blue text-sm">{row.calculatedPoints} pts</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 text-[10px] text-google-red font-bold">
                          <Milestone className="w-3.5 h-3.5" />
                          {row.milestoneReached}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center text-slate-400 dark:text-slate-655 max-w-lg mx-auto">
          <Trophy className="w-16 h-16 stroke-1 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Participants Found</h3>
          <p className="text-xs text-slate-505 mt-2 px-6">
            No rankings match your search queries. Try adjusting your query parameters.
          </p>
        </div>
      )}

    </div>
  );
};
export default Leaderboard;
