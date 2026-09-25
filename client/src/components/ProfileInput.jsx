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
        className="flex flex-col sm:flex-row gap-3 bg-[#111A2E] p-2.5 rounded-2xl border border-[#1E2A44] transition-all"
      >
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-[#4285F4] shrink-0" />
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error && setError) setError('');
            }}
            placeholder="https://www.cloudskillsboost.google/public_profiles/..."
            className="w-full pl-12 pr-4 py-3 bg-transparent text-[#E6EAF2] text-xs sm:text-sm font-semibold outline-none placeholder:text-[#94A3B8]"
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
              className="py-3 px-4 rounded-xl border border-[#1E2A44] text-[#94A3B8] hover:bg-[#0B1220] hover:text-[#E6EAF2] font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#4285F4] hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
        <div className="p-4 bg-[#EA4335]/10 border border-[#EA4335]/30 rounded-xl text-[#EA4335] text-xs font-semibold space-y-1 text-left">
          <div className="flex items-center gap-2 font-bold text-[#EA4335]">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#EA4335]" />
            <span>Unable to calculate your Arcade points.</span>
          </div>
          <p className="pl-6 text-[11px] text-[#94A3B8]">
            {error.includes('Unable to calculate') ? error : `${error} Please make sure your Google Skills Boost profile is public and try again.`}
          </p>
        </div>
      )}

      {/* Helper text */}
      <p className="text-center text-[11px] text-[#94A3B8] font-medium">
        Enter your public Google Skills Boost profile URL to analyze your Arcade progress.
      </p>
    </div>
  );
};

export default ProfileInput;
