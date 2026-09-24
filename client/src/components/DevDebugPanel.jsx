import React, { useState } from 'react';
import { Terminal, ChevronUp, ChevronDown, CheckCircle2, AlertTriangle } from 'lucide-react';

export const DevDebugPanel = ({ metrics }) => {
  const [collapsed, setCollapsed] = useState(true);

  // Only render in dev mode
  if (!import.meta.env.DEV || !metrics) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full font-mono text-xs shadow-2xl rounded-2xl overflow-hidden bg-[#050b14] border border-[#123a63] text-slate-200">
      
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-[#07111f] hover:bg-[#0b1f33] transition-colors font-bold text-blue-400"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>PROFILE DATA DEBUG</span>
        </div>
        {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Body */}
      {!collapsed && (
        <div className="p-4 space-y-2 text-[11px] max-h-72 overflow-y-auto bg-[#050b14]">
          <div className="flex justify-between border-b border-[#123a63] pb-1">
            <span className="text-slate-400">Profile URL:</span>
            <span className="truncate max-w-[160px] text-slate-200">{metrics.profileUrl || 'None'}</span>
          </div>

          <div className="flex justify-between border-b border-[#123a63] pb-1">
            <span className="text-slate-400">Game badges detected:</span>
            <span className="text-amber-400 font-bold">{metrics.gameBadgesCount} ({metrics.gamePoints} pts)</span>
          </div>

          <div className="flex justify-between border-b border-[#123a63] pb-1">
            <span className="text-slate-400">Skill badges detected:</span>
            <span className="text-blue-400 font-bold">{metrics.skillBadgesCount} ({metrics.skillPoints} pts)</span>
          </div>

          <div className="flex justify-between border-b border-[#123a63] pb-1">
            <span className="text-slate-400">Bonus detected:</span>
            <span className="text-purple-400 font-bold">+{metrics.bonusPoints} pts (highest)</span>
          </div>

          <div className="flex justify-between border-b border-[#123a63] pb-1">
            <span className="text-slate-400">Game points:</span>
            <span className="text-slate-200">{metrics.gamePoints}</span>
          </div>

          <div className="flex justify-between border-b border-[#123a63] pb-1">
            <span className="text-slate-400">Skill points:</span>
            <span className="text-slate-200">{metrics.skillPoints}</span>
          </div>

          <div className="flex justify-between border-b border-[#123a63] pb-1">
            <span className="text-slate-400">Bonus points:</span>
            <span className="text-slate-200">{metrics.bonusPoints}</span>
          </div>

          <div className="flex justify-between border-b border-[#123a63] pb-1">
            <span className="text-slate-400">Total:</span>
            <span className="text-emerald-400 font-bold">{metrics.totalPoints} Points</span>
          </div>

          <div className="flex justify-between border-b border-[#123a63] pb-1">
            <span className="text-slate-400">Current tier:</span>
            <span className="text-blue-400 font-bold">{metrics.currentTier.name} ({metrics.currentTier.minPoints}+ pts)</span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-400">Math Consistency:</span>
            {metrics.isVerified ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
              </span>
            ) : (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> MISMATCH
              </span>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default DevDebugPanel;
