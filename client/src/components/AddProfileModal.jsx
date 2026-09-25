import React, { useState } from 'react';
import { Search, X, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import { useAuth, API_URL } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AddProfileModal = ({ isOpen, onClose, onProfileAnalyzed }) => {
  const [profileUrl, setProfileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleScrape = async (e) => {
    e.preventDefault();
    const trimmed = profileUrl.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/profile/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileUrl: trimmed })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('active_arcade_profile', JSON.stringify(data));
        if (onProfileAnalyzed) onProfileAnalyzed(data);
        onClose();
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'Profile parsing failed.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to analyze profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/80 animate-fade-in">
      <div className="w-full max-w-lg app-card p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[#1E2A44]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#4285F4] text-white flex items-center justify-center shadow">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#E6EAF2]">Add Arcade Profile</h3>
              <p className="text-[10px] text-[#94A3B8] font-semibold">Paste a Google Cloud Skills Boost public profile URL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-[#E6EAF2] hover:bg-[#0B1220] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleScrape} className="py-5 space-y-4">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-[#4285F4]" />
            <input
              type="url"
              placeholder="https://cloudskillsboost.google/public_profiles/... (or 'mock')"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs font-semibold text-[#E6EAF2] placeholder:text-[#94A3B8] outline-none focus:border-[#4285F4] transition-colors"
              required
            />
          </div>

          {error && <p className="text-xs text-[#EA4335] font-bold">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#1E2A44] text-[#94A3B8] text-xs font-bold hover:bg-[#0B1220] hover:text-[#E6EAF2] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#4285F4] hover:bg-blue-500 text-white text-xs font-bold shadow flex items-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Analyze & Load</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
export default AddProfileModal;
