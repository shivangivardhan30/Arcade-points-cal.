import React from 'react';
import { Info, ShieldCheck } from 'lucide-react';

export const About = () => {
  return (
    <div id="resources" className="max-w-4xl mx-auto px-4 py-12">
      <div className="app-card p-8 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#1E2A44]">
          <Info className="w-5 h-5 text-[#4285F4]" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#E6EAF2]">
            ABOUT THIS PROJECT
          </h2>
        </div>

        <div className="space-y-3 text-xs font-medium text-[#94A3B8] leading-relaxed">
          <p>
            <strong className="text-[#E6EAF2]">Arcade Points Calculator</strong> is an open community tool designed for Google Cloud Arcade participants to evaluate profile statistics, point breakdowns, and milestone progress.
          </p>
          
          <div className="p-4 rounded-xl bg-[#FBBC04]/10 border border-[#FBBC04]/20 text-[#FBBC04] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#FBBC04] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-extrabold block text-[#FBBC04] uppercase tracking-wider text-[11px]">
                COMMUNITY PROJECT
              </span>
              <span className="text-[11px] leading-relaxed block text-[#94A3B8]">
                This project is an independent community utility created for learning and progress evaluation. It is <strong>NOT</strong> an official Google product and is not affiliated with or endorsed by Google LLC.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
