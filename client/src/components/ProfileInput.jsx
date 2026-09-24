import React, { useState } from 'react';
import { Search, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { validateProfileUrl } from '../utils/validation';

export const ProfileInput = ({ onCalculate, loading, error, setError, onReset, hasResults }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (setError) setError('');

    const validation = validateProfileUrl(url);
    if (!validation.isValid) {
      if (setError) setError(validation.errorMessage);
      return;
    }

    if (onCalculate) {
      onCalculate(url.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 bg-[#07111f] p-2.5 rounded-2xl sm:rounded-3xl border-2 border-[#123a63] shadow-2xl glow-card transition-all"
      >
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-blue-400 shrink-0" />
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error && setError) setError('');
            }}
            placeholder="https://www.cloudskillsboost.google/public_profiles/..."
            className="w-full pl-12 pr-4 py-3 bg-transparent text-white text-xs sm:text-sm font-semibold outline-none placeholder:text-slate-500 font-sans"
            disabled={loading}
          />
        </div>

        <div className="flex items-center gap-2">
          {hasResults && onReset && (
            <button
              type="button"
              onClick={() => {
                setUrl('');
                onReset();
              }}
              className="py-3.5 px-4 rounded-xl sm:rounded-2xl border border-[#123a63] text-slate-300 hover:bg-[#0b1f33] font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto py-3.5 px-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 btn-glow shrink-0 border border-blue-400/30"
          >
            {loading ? (
              <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Calculate Points</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* User-friendly Error Display */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs font-semibold space-y-1 animate-fade-in text-left">
          <div className="flex items-center gap-2 font-bold text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Unable to calculate your Arcade points.</span>
          </div>
          <p className="pl-6 text-[11px] text-slate-300">
            {error.includes('Unable to calculate') ? error : `${error} Please make sure your Google Skills Boost profile is public and try again.`}
          </p>
        </div>
      )}

      {/* Helper text */}
      <p className="text-center text-[11px] text-slate-400 font-medium">
        Enter your public Google Skills Boost profile URL to analyze your Arcade progress.
      </p>
    </div>
  );
};

export default ProfileInput;
