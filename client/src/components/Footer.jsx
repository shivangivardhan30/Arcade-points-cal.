import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800 py-8 bg-white/60 dark:bg-slate-950/60 text-center text-[11px] text-slate-500 dark:text-slate-400 font-semibold space-y-2">
      <div className="max-w-5xl mx-auto px-4 space-y-1">
        <p>© {new Date().getFullYear()} Arcade Points Calculator. Unofficial community utility.</p>
        <p>Google Cloud, Google Skills Boost, Qwiklabs, and Google Cloud Arcade are trademarks of Google LLC.</p>
      </div>
    </footer>
  );
};
