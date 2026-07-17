import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { Search, Compass, ShieldAlert, Award, Trophy, GraduationCap, ChevronDown, Check, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
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
      color: 'text-blue-500 bg-blue-500/5 border-blue-500/10'
    },
    {
      title: 'Automated Multipliers',
      description: 'Calculates points based on active admin settings and dynamically estimates closest reward milestones.',
      Icon: Cpu,
      color: 'text-indigo-500 bg-indigo-500/5 border-indigo-500/10'
    },
    {
      title: 'Detailed Analytics',
      description: 'Understand badges distribution, points growth over time, and weekly learning paths velocity.',
      Icon: Trophy,
      color: 'text-purple-500 bg-purple-500/5 border-purple-500/10'
    },
    {
      title: 'Global Standings',
      description: 'Publish your metrics to the community leaderboard. Compare scores and milestones with peers.',
      Icon: ShieldCheck,
      color: 'text-pink-500 bg-pink-500/5 border-pink-500/10'
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
    <div className="relative min-h-screen overflow-hidden pb-12">
      
      {/* Floating brand blobs */}
      <div className="absolute top-20 left-10 -z-10 w-96 h-96 rounded-full bg-blue-500/5 filter blur-3xl animate-blob-1" />
      <div className="absolute top-1/2 right-10 -z-10 w-80 h-80 rounded-full bg-purple-500/5 filter blur-3xl animate-blob-2" />
      <div className="absolute bottom-20 left-1/3 -z-10 w-96 h-96 rounded-full bg-indigo-500/5 filter blur-3xl animate-blob-3" />

      {/* Hero Header */}
      <section className="text-center py-16 sm:py-24 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/10 bg-indigo-500/5 text-indigo-500 text-xs font-bold mb-6"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Next-gen Google Cloud Arcade Tracking</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-white"
        >
          Analyze & Maximize Your <span className="text-gradient-brand">Cloud Achievements</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Connect your public Skills Boost link to instantly track completed badges, calculate estimated arcade credits, unlock achievement badges, and compare progress.
        </motion.p>

        {/* URL Scanner block */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleScrape}
          className="mt-10 max-w-xl mx-auto flex flex-col sm:flex-row gap-3 bg-white/60 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200 dark:border-slate-850 backdrop-blur-md shadow-md"
        >
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-3 w-5 h-5 text-slate-400" />
            <input
              type="url"
              placeholder="Paste Google Skills Public Profile URL (or type 'mock')"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-transparent outline-none border-0 text-sm text-slate-800 dark:text-white font-semibold"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-brand text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Analyze Profile
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </motion.form>

        {error && (
          <p className="text-xs text-rose-500 font-bold mt-4 text-center">{error}</p>
        )}
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-lg font-extrabold text-center text-slate-800 dark:text-white mb-10 uppercase tracking-wider">Features Suite</h2>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, idx) => {
            const { Icon } = f;
            return (
              <div key={idx} className="glass-card p-6 border border-slate-200/50 dark:border-slate-800/50 hover-lift">
                <div className={`p-3 rounded-2xl w-fit ${f.color} border border-indigo-500/10`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-extrabold text-slate-800 dark:text-white mt-4 uppercase tracking-wider">{f.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-semibold">{f.description}</p>
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
              className="w-full max-w-xl glass-card p-6 shadow-2xl overflow-hidden"
            >
              <h2 className="text-sm font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
                Scanned Profile Details
              </h2>
              
              <div className="py-4 space-y-4 text-xs font-semibold">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">PROFILE OWNER</span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-white mt-1 block">{scrapedData.name}</span>
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

                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Calculated Milestone</span>
                  <span className="text-xs font-extrabold text-indigo-500 dark:text-indigo-400 mt-1 block">
                    {getMilestoneReached(calculatePoints(scrapedData.labsCount, scrapedData.badgesCount))}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setScrapedData(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Close
                </button>
                
                <button
                  onClick={handleSaveScraped}
                  disabled={saving || saveSuccess}
                  className="flex-1 py-2 rounded-xl bg-gradient-brand text-white text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-sm"
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
              className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm"
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
                    <p className="p-5 pt-0 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 font-semibold">
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
      <footer className="text-center mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 max-w-6xl mx-auto px-4 text-[10px] text-slate-400 space-y-2 font-semibold">
        <p>© 2026 CloudArc Pro. Independent verification service. Not affiliated with Google LLC.</p>
        <p>Google Cloud, Google Skills Boost, and Qwiklabs are trademarks of Google LLC.</p>
      </footer>

    </div>
  );
};
export default Home;
