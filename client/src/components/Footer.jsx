import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-[#1E2A44] py-8 bg-[#0B1220] text-center text-[11px] text-[#94A3B8] font-semibold space-y-2">
      <div className="max-w-5xl mx-auto px-4 space-y-1">
        <p>© {new Date().getFullYear()} Arcade Points Calculator • Unofficial Community Tool.</p>
        <p className="text-[10px] text-[#94A3B8]/70">
          Google Cloud, Google Skills Boost, and Google Cloud Arcade are trademarks of Google LLC. This tool is not affiliated with Google.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
