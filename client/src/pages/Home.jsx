import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { Search, Compass, ShieldAlert, Award, Trophy, GraduationCap, ChevronDown, Check, ArrowRight, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Home = () => {
  const { user, getAuthHeaders } = useAuth();
  const { calculatePoints, getMilestoneReached } = useConfig();
  const navigate = useNavigate();

  // Scraper states
  const [profileUrl, setProfileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scrapedData, setScrapedData] = useState(null);
  
  // Save calculation states
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // FAQ Accordion Toggle
  const [openFaq, setOpenFaq] = useState(null);

  const handleScrape = async (e) => {
    e.preventDefault();
    const trimmedUrl = profileUrl.trim();
    if (!trimmedUrl) return;
    
    setLoading(true);
    setError('');
    setScrapedData(null);
    setSaveSuccess(false);

    // Validate URL formats
    const isMock = trimmedUrl.toLowerCase() === 'mock' || 
                   trimmedUrl.toLowerCase() === 'test' || 
                   trimmedUrl.toLowerCase().startsWith('mock-');
                   
    const isSkillsBoost = trimmedUrl.startsWith('https://www.cloudskillsboost.google/public_profiles/') || 
                          trimmedUrl.startsWith('https://cloudskillsboost.google/public_profiles/') ||
                          trimmedUrl.startsWith('https://www.qwiklabs.com/public_profiles/') ||
                          trimmedUrl.startsWith('https://qwiklabs.com/public_profiles/') ||
                          trimmedUrl.startsWith('https://www.skills.google/public_profiles/') ||
                          trimmedUrl.startsWith('https://skills.google/public_profiles/');

    if (!isMock && !isSkillsBoost) {
      setError('Invalid URL Format. Please enter a valid Google Cloud Skills Boost public profile link (starting with https://www.skills.google/public_profiles/).');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/profile/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileUrl: trimmedUrl })
      });

      const data = await response.json();

      if (response.ok) {
        setScrapedData(data);
      } else {
        throw new Error(data.message || 'Profile parsing failed.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Backend Unreachable: The CloudArc Pro tracker API is offline. Ensure the backend server is running on http://localhost:5000.');
      } else {
        setError(err.message || 'Parsing failed: Unable to extract profile details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScraped = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/calculations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          labsCount: scrapedData.labsCount,
          badgesCount: scrapedData.badgesCount
        })
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          setScrapedData(null);
          navigate('/dashboard');
        }, 1500);
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const features = [
    {
      title: 'Profile Insights',
      description: 'Fetch your cloud credentials profile URL. Our analyzer extracts completed courses and badges in seconds.',
      Icon: Search,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20 dark:bg-blue-500/5'
    },
    {
      title: 'Automated Multipliers',
      description: 'Calculates points based on active admin settings and dynamically estimates closest reward milestones.',
      Icon: Cpu,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20 dark:bg-indigo-500/5'
    },
    {
      title: 'Detailed Analytics',
      description: 'Understand badges distribution, points growth over time, and weekly learning paths velocity.',
      Icon: Trophy,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20 dark:bg-purple-500/5'
    },
    {
      title: 'Global Standings',
      description: 'Publish your metrics to the community leaderboard. Compare scores and milestones with peers.',
      Icon: ShieldCheck,
      color: 'text-pink-500 bg-pink-500/10 border-pink-500/20 dark:bg-pink-500/5'
    }
  ];

  const faqs = [
    {
      q: 'What is CloudArc Pro?',
      a: 'CloudArc Pro is a premium SaaS analytics platform that parses your Google Cloud Skills Boost public profile to calculate point metrics, showcase badges, track milestones, and visualize progress trends.'
    },
    {
      q: 'How do I locate my public profile link?',
      a: 'Log in to Google Cloud Skills Boost, click on your profile avatar in the upper right corner, choose "Profile", check the "Make profile public" box, and copy the generated visibility link.'
    },
    {
      q: 'How are estimated points calculated?',
      a: 'Points are computed matching default values (1 pt per standard lab quest and 2 pts per completed skill badge) or parameters updated by admins in the point multipliers controller.'
    },
    {
      q: 'Are scans private?',
      a: 'Yes, scans are private unless you log in and opt to save your evaluation. Saving adds the progress to your personal dashboard and lists you on the public leaderboard.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-mesh-grid pb-20">
      
      {/* Floating brand blobs */}
      <div className="absolute top-20 left-10 -z-10 w-96 h-96 rounded-full bg-blue-500/10 filter blur-3xl animate-blob-1 dark:bg-blue-500/5" />
      <div className="absolute top-1/2 right-10 -z-10 w-80 h-80 rounded-full bg-purple-500/10 filter blur-3xl animate-blob-2 dark:bg-purple-500/5" />
      <div className="absolute bottom-20 left-1/3 -z-10 w-96 h-96 rounded-full bg-indigo-500/10 filter blur-3xl animate-blob-3 dark:bg-indigo-500/5" />

      {/* Hero Header */}
      <section className="text-center py-20 sm:py-32 max-w-4xl mx-auto px-4">
        
        {/* Pulsing Tag Label */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-8 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span>CloudArc Pro v2.0 Platform is active</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-[1.1]"
        >
          Analyze & Elevate Your <br />
          <span className="text-gradient-brand">Cloud Credentials</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Connect your Google Cloud Skills Boost public profile link. Instantly verify completed badges, forecast next-tier points milestones, and publish standing records.
        </motion.p>

        {/* URL Scanner block */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleScrape}
          className="mt-12 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-lg glow-card"
        >
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <input
              type="url"
              placeholder="Enter Google Skills Boost profile URL (or 'mock')"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-transparent outline-none border-0 text-xs sm:text-sm text-slate-800 dark:text-white font-semibold placeholder:text-slate-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-brand text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 btn-glow"
          >
            {loading ? (
              <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Analyze Profile
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.form>

        {error && (
          <p className="text-xs text-rose-500 font-bold mt-4 text-center">{error}</p>
        )}
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-550 dark:text-indigo-400">Features Matrix</h2>
          <p className="text-xl font-bold text-slate-800 dark:text-white mt-2">Professional SaaS points evaluation tracking tool</p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, idx) => {
            const { Icon } = f;
            return (
              <div key={idx} className="glass-card p-6 border border-slate-200/50 dark:border-slate-800/50 hover-lift glow-card">
                <div className={`p-3.5 rounded-2xl w-fit ${f.color} border border-indigo-500/10`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-extrabold text-slate-800 dark:text-white mt-5 uppercase tracking-wider">{f.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed font-semibold">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scrape Result Evaluation Modal */}
      <AnimatePresence>
        {scrapedData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl glass-card p-6 shadow-2xl overflow-hidden glow-card"
            >
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3.5">
                <h2 className="text-sm font-bold text-slate-805 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-500" /> Scanned Profile Results
                </h2>
              </div>
              
              <div className="py-5 space-y-4 text-xs font-semibold">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-brand text-white flex items-center justify-center font-bold text-sm">
                    {scrapedData.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">PROFILE OWNER</span>
                    <span className="text-sm font-extrabold text-slate-850 dark:text-white mt-0.5 block">{scrapedData.name}</span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 text-center font-bold">
                  <div className="p-3 bg-blue-500/5 border border-blue-500/10 text-blue-500 rounded-xl">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Labs Completed</span>
                    <span className="text-lg font-extrabold mt-1 block">{scrapedData.labsCount}</span>
                  </div>

                  <div className="p-3 bg-purple-500/5 border border-purple-500/10 text-purple-500 rounded-xl">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Skill Badges</span>
                    <span className="text-lg font-extrabold mt-1 block">{scrapedData.badgesCount}</span>
                  </div>

                  <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 text-indigo-500 rounded-xl">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Arcade Score</span>
                    <span className="text-lg font-extrabold mt-1 block">{calculatePoints(scrapedData.labsCount, scrapedData.badgesCount)} pts</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-bold">Calculated Milestone</span>
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 block">
                      {getMilestoneReached(calculatePoints(scrapedData.labsCount, scrapedData.badgesCount))}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-3.5 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setScrapedData(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Close
                </button>
                
                <button
                  onClick={handleSaveScraped}
                  disabled={saving || saveSuccess}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-brand text-white text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-sm btn-glow"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      Saved!
                    </>
                  ) : (
                    <>
                      {user ? 'Save to History' : 'Sign In to Save'}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FAQs Section */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-lg font-extrabold text-center text-slate-800 dark:text-white mb-8 uppercase tracking-wider">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center p-5 text-left text-xs sm:text-sm font-bold text-slate-750 dark:text-slate-200 outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <p className="p-5 pt-0 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 font-semibold">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 max-w-6xl mx-auto px-4 text-[10px] text-slate-400 space-y-2 font-semibold">
        <p>© 2026 CloudArc Pro. Independent verification service. Not affiliated with Google LLC.</p>
        <p>Google Cloud, Google Skills Boost, and Qwiklabs are trademarks of Google LLC.</p>
      </footer>

    </div>
  );
};
export default Home;
