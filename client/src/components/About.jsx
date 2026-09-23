import React from 'react';
import { Info, ShieldCheck } from 'lucide-react';

export const About = () => {
  return (
    <div id="about" className="max-w-4xl mx-auto px-4 py-12">
      <div className="glass-card p-8 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-4 hover-lift glow-card">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-800">
          <Info className="w-5 h-5 text-indigo-500" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
            About This Project
          </h2>
        </div>

        <div className="space-y-3 text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong>Arcade Points Calculator</strong> is an open-source, community-built utility designed to help Google Cloud Arcade participants monitor their badge completions, evaluate milestone progress, and understand points distribution.
          </p>
          
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold block">Unofficial Community Project</span>
              <span>
                This tool is an independent community project. It is <strong>NOT</strong> an official Google product, and is not endorsed by, sponsored by, or affiliated with Google LLC.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
