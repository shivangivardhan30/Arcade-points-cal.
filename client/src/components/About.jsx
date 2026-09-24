import React from 'react';
import { Info, ShieldCheck } from 'lucide-react';

export const About = () => {
  return (
    <div id="resources" className="max-w-4xl mx-auto px-4 py-12">
      <div className="glass-card p-8 border border-[#123a63] bg-[#07111f]/90 rounded-3xl space-y-4 hover-lift glow-card">
        <div className="flex items-center gap-2 pb-3 border-b border-[#123a63]/50">
          <Info className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
            ABOUT THIS PROJECT
          </h2>
        </div>

        <div className="space-y-3 text-xs font-medium text-slate-300 leading-relaxed">
          <p>
            <strong>Arcade Points Calculator</strong> is an open community tool designed for Google Cloud Arcade participants to evaluate profile statistics, point breakdowns, and milestone progress.
          </p>
          
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-extrabold block text-amber-400 uppercase tracking-wider text-[11px]">
                UNOFFICIAL COMMUNITY TOOL
              </span>
              <span className="text-[11px] leading-relaxed block">
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
