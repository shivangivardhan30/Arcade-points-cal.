import React, { useEffect, useState } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { CardSkeleton } from '../components/SkeletonLoader';
import { GraduationCap, Search, ExternalLink, Play, BookOpen, Award, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/resources`);
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      } else {
        throw new Error('Failed to load resources');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'lab':
        return <CheckCircle2 className="w-5 h-5 text-google-green" />;
      case 'badge':
        return <Award className="w-5 h-5 text-google-yellow" />;
      case 'path':
        return <BookOpen className="w-5 h-5 text-google-blue" />;
      case 'video':
        return <Play className="w-5 h-5 text-google-red" />;
      default:
        return <GraduationCap className="w-5 h-5 text-slate-500" />;
    }
  };

  // Filter resources based on active category and search filter
  const filteredResources = resources.filter((r) => {
    const matchesTab = activeTab === 'all' || r.category === activeTab;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    
    return matchesTab && matchesSearch;
  });

  const tabItems = [
    { id: 'all', label: 'All Catalog' },
    { id: 'lab', label: 'Latest Labs' },
    { id: 'badge', label: 'Skill Badges' },
    { id: 'path', label: 'Learning Paths' },
    { id: 'video', label: 'Helpful Videos' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-google-blue/10 dark:bg-google-blue/20 text-google-blue rounded-2xl">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Arcade Resources</h1>
          <p className="text-xs text-slate-505 dark:text-slate-400">
            Browse guides, lab tutorials, learning tracks, and video references.
          </p>
        </div>
      </div>

      {/* Toolbar: Search and Tabs */}
      <div className="space-y-4">
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-450" />
          <input
            type="text"
            placeholder="Search resources or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all shadow-sm"
          />
        </div>

        {/* Tab Items Row */}
        <div className="flex flex-wrap gap-2 pb-1.5 border-b border-slate-200 dark:border-slate-850">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-google-blue text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Resources Cards Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : filteredResources.length > 0 ? (
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
                    
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-450 uppercase border border-slate-200/50 dark:border-slate-800/50">
                      {res.category}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">{res.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-3">
                    {res.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {res.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[8px] font-semibold bg-google-blue/10 text-google-blue px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-205 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] rounded-lg transition-all"
                  >
                    Launch <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="glass-card p-12 text-center text-slate-400 dark:text-slate-600 max-w-md mx-auto">
          <BookOpen className="w-16 h-16 stroke-1 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200">No Guides Found</h3>
          <p className="text-xs text-slate-500 mt-2 px-6">
            We couldn't find any resources matching your search details. Try exploring other catalog tabs.
          </p>
        </div>
      )}

    </div>
  );
};
export default Resources;
