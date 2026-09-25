import React, { useState } from 'react';
import { Trophy, Search, Filter, Users, Milestone, Award, CheckCircle2, RefreshCw, X, Scaling } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Leaderboard = () => {
  const [search, setSearch] = useState('');
  const [filterMilestone, setFilterMilestone] = useState('all');
  
  // Comparative panel states
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Mock Leaderboard rankings for SaaS UI
  const rankings = [
    { _id: '1', name: 'Nikhil Sharma', labsCount: 30, badgesCount: 18, calculatedPoints: 66, milestoneReached: 'Gold Arcade', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
    { _id: '2', name: 'Aarav Mehta', labsCount: 28, badgesCount: 16, calculatedPoints: 60, milestoneReached: 'Gold Arcade', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' },
    { _id: '3', name: 'Ishita Kapoor', labsCount: 25, badgesCount: 14, calculatedPoints: 53, milestoneReached: 'Gold Arcade', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
    { _id: '4', name: 'Shivangi Vardhan', labsCount: 18, badgesCount: 12, calculatedPoints: 42, milestoneReached: 'Silver Arcade', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
    { _id: '5', name: 'Rohan Verma', labsCount: 15, badgesCount: 10, calculatedPoints: 35, milestoneReached: 'Silver Arcade', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80' },
    { _id: '6', name: 'Sneha Patel', labsCount: 12, badgesCount: 8, calculatedPoints: 28, milestoneReached: 'Silver Arcade', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80' },
    { _id: '7', name: 'Kabir Sen', labsCount: 8, badgesCount: 4, calculatedPoints: 16, milestoneReached: 'Bronze Arcade', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80' }
  ];

  const handleCompareSelect = (user, e) => {
    const checked = e.target.checked;
    if (checked) {
      if (selectedForCompare.length >= 2) {
        alert('You can only compare up to two participants at a time.');
        e.target.checked = false;
        return;
      }
      setSelectedForCompare([...selectedForCompare, user]);
    } else {
      setSelectedForCompare(selectedForCompare.filter(u => u._id !== user._id));
    }
  };

  const filteredRankings = rankings.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(search.toLowerCase());
    const matchesMilestone = filterMilestone === 'all' || row.milestoneReached === filterMilestone;
    return matchesSearch && matchesMilestone;
  });

  // Top 3 Podium Sorting
  const podiumUsers = rankings.slice(0, 3);
  const podiumOrder = [podiumUsers[1], podiumUsers[0], podiumUsers[2]]; // [Silver, Gold, Bronze] for display

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/20 rounded-2xl">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#E6EAF2]">CloudArc Leaderboards</h1>
            <p className="text-xs text-[#94A3B8]">
              Verify standing, analyze rank metrics, and compare profiles side-by-side.
            </p>
          </div>
        </div>

        {selectedForCompare.length === 2 && (
          <button
            onClick={() => setShowCompareModal(true)}
            className="flex items-center gap-1.5 py-2 px-4 bg-[#4285F4] hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all"
          >
            <Scaling className="w-4 h-4" /> Compare selected (2)
          </button>
        )}
      </div>

      {/* Top 3 visual podium */}
      <div className="app-card p-6 flex flex-col md:flex-row justify-around items-end gap-8 pt-10">
        {podiumOrder.map((user, idx) => {
          if (!user) return null;
          const displayIdx = idx === 0 ? 2 : idx === 1 ? 1 : 3; // Silver, Gold, Bronze
          const ringColor = displayIdx === 1 ? 'ring-[#FBBC04]' : displayIdx === 2 ? 'ring-[#4285F4]' : 'ring-[#34A853]';
          const height = displayIdx === 1 ? 'h-40 border-[#FBBC04]/20 bg-[#FBBC04]/5' : displayIdx === 2 ? 'h-32 border-[#4285F4]/20 bg-[#4285F4]/5' : 'h-28 border-[#34A853]/20 bg-[#34A853]/5';
          return (
            <div key={user._id} className="flex flex-col items-center space-y-3 font-bold text-center">
              <div className="relative">
                <img src={user.avatar} alt="podium" className={`w-20 h-20 ring-4 ${ringColor} rounded-full object-cover border-4 border-[#0B1220] shadow-lg`} />
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#4285F4] text-white text-[10px] font-extrabold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#0B1220]">
                  {displayIdx}
                </span>
              </div>

              <div className={`w-36 ${height} flex flex-col justify-between p-4 rounded-xl border`}>
                <div className="space-y-0.5">
                  <span className="text-xs text-[#E6EAF2] block truncate">{user.name}</span>
                  <span className="text-[10px] text-[#94A3B8] block truncate">{user.milestoneReached}</span>
                </div>
                <span className="text-sm font-extrabold text-[#4285F4] block">{user.calculatedPoints} pts</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#111A2E] p-4 rounded-xl border border-[#1E2A44]">
        
        {/* Search */}
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by participant name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs text-[#E6EAF2] placeholder:text-[#94A3B8] outline-none focus:border-[#4285F4] transition-all font-semibold"
          />
        </div>

        {/* Milestone Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#94A3B8] shrink-0" />
          <select
            value={filterMilestone}
            onChange={(e) => setFilterMilestone(e.target.value)}
            className="px-4 py-2 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs outline-none focus:border-[#4285F4] transition-all text-[#E6EAF2] font-bold"
          >
            <option value="all">All Tiers</option>
            <option value="Bronze Arcade">Bronze Arcade</option>
            <option value="Silver Arcade">Silver Arcade</option>
            <option value="Gold Arcade">Gold Arcade</option>
          </select>
        </div>

      </div>

      {/* Rankings Table with Comparison checkbox columns */}
      <div className="app-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B1220] text-[#94A3B8] border-b border-[#1E2A44] text-[10px] uppercase font-bold tracking-wider">
                <th className="py-4 px-6 text-center">Compare</th>
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Quests Completed</th>
                <th className="py-4 px-6">Badges Completed</th>
                <th className="py-4 px-6">Arcade Points</th>
                <th className="py-4 px-6">Milestone Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2A44] text-xs font-semibold text-[#E6EAF2]">
              {filteredRankings.map((row, idx) => {
                const rank = idx + 1;
                const isSelected = selectedForCompare.some(u => u._id === row._id);
                return (
                  <tr key={row._id} className="hover:bg-[#0B1220]/50 transition-colors">
                    <td className="py-4 px-6 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleCompareSelect(row, e)}
                        className="w-4 h-4 rounded text-[#4285F4] focus:ring-[#4285F4] cursor-pointer"
                      />
                    </td>
                    <td className="py-4 px-6 font-bold text-[#E6EAF2]">#{rank}</td>
                    <td className="py-4 px-6 font-extrabold text-[#E6EAF2] flex items-center gap-2">
                      <img src={row.avatar} alt="avatar" className="w-6 h-6 rounded-full object-cover ring-2 ring-[#4285F4]/10" />
                      {row.name}
                    </td>
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" />
                        {row.labsCount}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-[#4285F4]" />
                        {row.badgesCount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#4285F4] font-extrabold">{row.calculatedPoints} pts</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#FBBC04] font-extrabold">
                        <Milestone className="w-3.5 h-3.5" />
                        {row.milestoneReached}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparison Modal Overlay */}
      <AnimatePresence>
        {showCompareModal && selectedForCompare.length === 2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/80">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl app-card p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-[#1E2A44] pb-3 mb-6">
                <h2 className="text-sm font-bold text-[#E6EAF2] uppercase tracking-wider flex items-center gap-2">
                  <Scaling className="w-4 h-4 text-[#4285F4]" /> Participant Comparison
                </h2>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="p-1 rounded-lg text-[#94A3B8] hover:text-[#E6EAF2]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Side-by-Side Comparison grid */}
              <div className="grid gap-6 sm:grid-cols-2 text-center text-xs font-bold">
                {selectedForCompare.map((user) => (
                  <div key={user._id} className="p-4 bg-[#0B1220] border border-[#1E2A44] rounded-xl space-y-4">
                    <img src={user.avatar} alt="avatar" className="w-14 h-14 rounded-full object-cover mx-auto ring-4 ring-[#4285F4]/10" />
                    <h3 className="text-sm font-extrabold text-[#E6EAF2]">{user.name}</h3>
                    
                    <div className="divide-y divide-[#1E2A44] text-[11px] font-semibold text-[#94A3B8]">
                      <div className="py-2.5 flex justify-between">
                        <span>Milestone Level</span>
                        <span className="font-bold text-[#FBBC04]">{user.milestoneReached}</span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span>Quests Completed</span>
                        <span className="font-bold text-[#E6EAF2]">{user.labsCount}</span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span>Badges Completed</span>
                        <span className="font-bold text-[#E6EAF2]">{user.badgesCount}</span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span>Calculated Points</span>
                        <span className="font-extrabold text-[#4285F4]">{user.calculatedPoints} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setShowCompareModal(false); setSelectedForCompare([]); }}
                className="w-full py-2.5 mt-6 rounded-xl bg-[#0B1220] border border-[#1E2A44] hover:bg-[#1E2A44] text-[#E6EAF2] font-bold"
              >
                Reset and Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default Leaderboard;
