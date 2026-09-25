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
        return <CheckCircle2 className="w-5 h-5 text-[#34A853]" />;
      case 'path':
        return <BookOpen className="w-5 h-5 text-[#4285F4]" />;
      case 'tips':
        return <Lightbulb className="w-5 h-5 text-[#FBBC04]" />;
      case 'video':
        return <Play className="w-5 h-5 text-[#4285F4]" />;
      default:
        return <GraduationCap className="w-5 h-5 text-[#94A3B8]" />;
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
        <div className="p-3 bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/20 rounded-2xl">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#E6EAF2]">CloudArc Pro Catalog</h1>
          <p className="text-xs text-[#94A3B8]">
            Browse learning tracks, study guides, practical tips, and video resources.
          </p>
        </div>
      </div>

      {/* Search and Tabs Toolbar */}
      <div className="space-y-4">
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search guides, paths, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs outline-none focus:border-[#4285F4] transition-all text-[#E6EAF2] placeholder:text-[#94A3B8] font-semibold"
          />
        </div>

        {/* Categories Tabs Row */}
        <div className="flex flex-wrap gap-2 pb-1.5 border-b border-[#1E2A44]">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#4285F4] text-white shadow'
                  : 'text-[#94A3B8] hover:bg-[#0B1220] hover:text-[#E6EAF2]'
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
              className="app-card p-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-[#0B1220] rounded-xl border border-[#1E2A44]">
                    {getCategoryIcon(res.category)}
                  </div>
                  
                  <span className="text-[8px] font-extrabold px-2 py-0.5 rounded bg-[#4285F4]/10 text-[#4285F4] uppercase tracking-wider">
                    {res.category}
                  </span>
                </div>

                <h3 className="text-xs font-extrabold text-[#E6EAF2] uppercase tracking-wider line-clamp-1">{res.title}</h3>
                <p className="text-[11px] text-[#94A3B8] leading-normal font-semibold line-clamp-3">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#1E2A44] flex flex-wrap justify-between items-center gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {res.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[8px] font-bold bg-[#4285F4]/10 text-[#4285F4] px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <a
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-[#0B1220] hover:bg-[#1E2A44] border border-[#1E2A44] text-[#E6EAF2] font-extrabold text-[10px] rounded-lg transition-all"
                >
                  View Link <ExternalLink className="w-3 h-3 text-[#4285F4]" />
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
