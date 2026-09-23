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
        className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl sm:rounded-3xl border-2 border-indigo-500/20 dark:border-indigo-500/30 shadow-lg glow-card transition-all"
      >
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-indigo-500 shrink-0" />
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error && setError) setError('');
            }}
            placeholder="https://www.cloudskillsboost.google/public_profiles/..."
            className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-800 dark:text-white text-xs sm:text-sm font-semibold outline-none placeholder:text-slate-400 font-sans"
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
              className="py-3.5 px-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto py-3.5 px-8 rounded-xl sm:rounded-2xl bg-gradient-brand text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 btn-glow shrink-0"
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
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper text */}
      <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        Enter your public Google Skills Boost profile URL to calculate your Arcade progress.
      </p>
    </div>
  );
};
