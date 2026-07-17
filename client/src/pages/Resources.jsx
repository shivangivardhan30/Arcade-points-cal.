import React, { useState } from 'react';
import { GraduationCap, Search, ExternalLink, Play, BookOpen, Lightbulb, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Resources = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // SaaS Dummy Data for Resources Catalog
  const resources = [
    { _id: '1', title: 'Generative AI Fundamentals', category: 'path', description: 'Beginner track covering Generative AI, Large Language Models, and Vertex AI tools.', tags: ['Generative AI', 'Vertex AI'], link: 'https://www.cloudskillsboost.google/paths/118' },
    { _id: '2', title: 'Google Cloud Computing Foundations', category: 'path', description: 'Structured course detail covering cloud infrastructure, databases, and networks.', tags: ['Infrastructure', 'Intro'], link: 'https://www.cloudskillsboost.google/paths/14' },
    { _id: '3', title: 'Build and Secure Networks in Google Cloud', category: 'lab', description: 'Challenge lab verifying network design, VPC routing, and firewall rules setup.', tags: ['Networking', 'Security'], link: 'https://www.cloudskillsboost.google/course_templates/352' },
    { _id: '4', title: 'Cloud Engineering Path Study Guide', category: 'tips', description: 'Expert recommendations and shortcuts on how to navigate exam prep courses efficiently.', tags: ['Study Guide', 'Tips'], link: 'https://www.skills.google/' },
    { _id: '5', title: 'Getting Started with Qwiklabs Challenges', category: 'video', description: 'Quick walkthrough video detailing how qwiklabs console operates and tracks logs.', tags: ['Tutorial', 'Video'], link: 'https://www.youtube.com/' }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'lab':
        return <CheckCircle2 className="w-5 h-5 text-indigo-500" />;
      case 'path':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'tips':
        return <Lightbulb className="w-5 h-5 text-amber-500" />;
      case 'video':
        return <Play className="w-5 h-5 text-pink-500" />;
      default:
        return <GraduationCap className="w-5 h-5 text-slate-500" />;
    }
  };

  const filteredResources = resources.filter((r) => {
    const matchesTab = activeTab === 'all' || r.category === activeTab;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    
    return matchesTab && matchesSearch;
  });

  const tabItems = [
    { id: 'all', label: 'All Catalog' },
    { id: 'lab', label: 'Quests & Labs' },
    { id: 'path', label: 'Learning Paths' },
    { id: 'tips', label: 'Pro Tips' },
    { id: 'video', label: 'Videos' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 rounded-2xl">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-white">CloudArc Pro Catalog</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Browse learning tracks, study guides, practical tips, and video resources.
          </p>
        </div>
      </div>

      {/* Search and Tabs Toolbar */}
      <div className="space-y-4">
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-450" />
          <input
            type="text"
            placeholder="Search guides, paths, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm font-semibold"
          />
        </div>

        {/* Categories Tabs Row */}
        <div className="flex flex-wrap gap-2 pb-1.5 border-b border-slate-200 dark:border-slate-850">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-brand text-white shadow-sm'
                  : 'text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredResources.map((res) => (
            <motion.div
              key={res._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 flex flex-col justify-between hover-lift"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                    {getCategoryIcon(res.category)}
                  </div>
                  
                  <span className="text-[8px] font-extrabold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">
                    {res.category}
                  </span>
                </div>

                <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider line-clamp-1">{res.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-semibold line-clamp-3">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/50 dark:border-slate-850 flex flex-wrap justify-between items-center gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {res.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[8px] font-bold bg-indigo-500/5 text-indigo-500 px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <a
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 border border-slate-250 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[10px] rounded-lg transition-all"
                >
                  View Link <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
};
export default Resources;
