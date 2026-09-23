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
      <section className="text-center py-16 sm:py-28 max-w-4xl mx-auto px-4">
        
        {/* Header Category Tag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-6 shadow-sm uppercase tracking-wider"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span>Google Cloud Arcade · Points Tracker · Facilitator Program</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-[1.1]"
        >
          Meet Your Ultimate & <br />
          <span className="text-gradient-brand">Google Cloud Arcade</span> Points Calculator
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          The #1 most reliable platform for the Google Cloud Arcade community. Calculate points, track completed & missing badges, climb live leaderboards, and monitor swag tier eligibility.
        </motion.p>

        {/* Profile URL Input Bar */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleScrape}
          className="mt-10 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 bg-white/90 dark:bg-slate-900/80 p-2.5 rounded-3xl border-2 border-indigo-500/20 dark:border-indigo-500/30 backdrop-blur-md shadow-xl glow-card"
        >
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <input
              type="url"
              placeholder="Paste your Google Cloud Skills Boost public profile URL (or 'mock')"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-transparent outline-none border-0 text-xs sm:text-sm text-slate-800 dark:text-white font-semibold placeholder:text-slate-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-brand text-white text-xs font-bold shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 btn-glow"
          >
            {loading ? (
              <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Calculate Points
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.form>

        {error && (
          <p className="text-xs text-rose-500 font-bold mt-4 text-center">{error}</p>
        )}

        <div className="mt-4 flex justify-center items-center text-xs font-semibold text-slate-500 dark:text-slate-400 gap-1.5">
          <span>Having trouble finding your public profile URL?</span>
          <button
            onClick={() => navigate('/resources')}
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-0.5"
          >
            Click here for help <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </section>

      {/* Live Platform Engagement Ticker */}
      <section className="w-full border-y border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md py-6 mb-16">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-heading">142.3K+</span>
            <span className="block text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Visitors</span>
          </div>
          <div className="space-y-1 md:border-l border-slate-200 dark:border-slate-800">
            <span className="text-2xl sm:text-3xl font-black text-amber-500 font-heading">2.13M+</span>
            <span className="block text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Analyses Run</span>
          </div>
          <div className="space-y-1 md:border-l border-slate-200 dark:border-slate-800">
            <span className="text-2xl sm:text-3xl font-black text-emerald-500 font-heading">52.4K+</span>
            <span className="block text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Unique Profiles</span>
          </div>
          <div className="space-y-1 md:border-l border-slate-200 dark:border-slate-800">
            <span className="text-2xl sm:text-3xl font-black text-purple-500 font-heading">98%</span>
            <span className="block text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Returning Users</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Everything You Need</h2>
          <p className="text-2xl font-black text-slate-800 dark:text-white mt-2">Master Google Cloud Arcade</p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, idx) => {
            const { Icon } = f;
            return (
              <div key={idx} className="glass-card p-6 border border-slate-200/60 dark:border-slate-800/60 hover-lift glow-card">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl glass-card p-6 shadow-2xl overflow-hidden glow-card max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={scrapedData.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                    alt="avatar"
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <h2 className="text-base font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
                      {scrapedData.name}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-semibold">{scrapedData.memberSince || 'Google Cloud Arcade Learner'}</p>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20">
                  {scrapedData.swagTier || 'Standard Swag Eligible'}
                </span>
              </div>
              
              <div className="py-5 space-y-5">
                {/* Stats Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-bold">
                  <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Total Arcade Points</span>
                    <span className="text-xl font-black mt-1 block">
                      {scrapedData.totalPoints !== undefined ? scrapedData.totalPoints : calculatePoints(scrapedData.labsCount, scrapedData.badgesCount)} pts
                    </span>
                  </div>

                  <div className="p-3.5 bg-purple-500/5 border border-purple-500/10 text-purple-500 rounded-xl">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Skill Badges (0.5pt)</span>
                    <span className="text-xl font-black mt-1 block">{scrapedData.skillBadgesCount || scrapedData.badgesCount}</span>
                  </div>

                  <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 text-amber-500 rounded-xl">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Game Badges (1pt)</span>
                    <span className="text-xl font-black mt-1 block">{scrapedData.gameBadgesCount || 0}</span>
                  </div>

                  <div className="p-3.5 bg-blue-500/5 border border-blue-500/10 text-blue-500 rounded-xl">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Trivia / Quests (1pt)</span>
                    <span className="text-xl font-black mt-1 block">{(scrapedData.triviaBadgesCount || 0) + (scrapedData.labsCount || 0)}</span>
                  </div>
                </div>

                {/* Milestone Progress Banner */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-bold">Arcade Facilitator Milestone</span>
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 block">
                      {getMilestoneReached(scrapedData.totalPoints || calculatePoints(scrapedData.labsCount, scrapedData.badgesCount))}
                    </span>
                  </div>
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>

                {/* Badges List Preview */}
                {scrapedData.badges && scrapedData.badges.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Extracted Credentials & Badges ({scrapedData.badges.length})
                    </span>
                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                      {scrapedData.badges.map((b, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-sm">{b.title}</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 shrink-0 ml-2">
                            {b.category || b.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setScrapedData(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Close
                </button>
                
                <button
                  onClick={handleSaveScraped}
                  disabled={saving || saveSuccess}
                  className="flex-1 py-3 rounded-xl bg-gradient-brand text-white text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-md btn-glow"
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
                      {user ? 'Save Profile' : 'Sign In to Save'}
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
        <p>© 2026 CloudArc Pro. Independent Google Cloud Arcade points calculator. Not affiliated with Google LLC.</p>
        <p>Google Cloud, Google Skills Boost, and Qwiklabs are trademarks of Google LLC.</p>
      </footer>

    </div>
  );
};
export default Home;
