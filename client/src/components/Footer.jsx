import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-[#123a63]/50 py-8 bg-[#050b14] text-center text-[11px] text-slate-400 font-semibold space-y-2">
      <div className="max-w-5xl mx-auto px-4 space-y-1">
        <p>© {new Date().getFullYear()} Arcade Points Calculator • Unofficial Community Tool.</p>
        <p className="text-[10px] text-slate-500">
          Google Cloud, Google Skills Boost, and Google Cloud Arcade are trademarks of Google LLC. This tool is not affiliated with Google.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
