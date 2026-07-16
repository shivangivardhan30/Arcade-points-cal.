import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { Search, CloudLightning, ShieldAlert, Award, Trophy, GraduationCap, ChevronDown, Check, ArrowRight } from 'lucide-react';
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

    // Validate URL before making request
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
      setError('Invalid URL: Please enter a valid Google Cloud Skills Boost public profile URL (starting with https://www.cloudskillsboost.google/public_profiles/).');
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
        throw new Error(data.message || 'Parsing failed: The server returned an error during parsing.');
      }
    } catch (err) {
      console.error('Fetch error details:', err);
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Backend Unavailable: The progress tracker API is unreachable. Please verify that the backend server is running on http://localhost:5000.');
      } else {
        setError(err.message || 'Parsing failed: Unable to parse profile information.');
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
        throw new Error('Failed to save calculation');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const features = [
    {
      title: 'Automated Scraping',
      description: 'Paste your Skills Boost profile URL. Our parser extracts your completed badges and counts instantly.',
      Icon: Search,
      color: 'text-google-blue bg-google-blue/10 border-google-blue/10'
    },
    {
      title: 'Points & Milestone Calculator',
      description: 'Evaluates your progress against active multipliers and tracks your path toward swag tiers.',
      Icon: CloudLightning,
      color: 'text-google-green bg-google-green/10 border-google-green/10'
    },
    {
      title: 'Community Leaderboards',
      description: 'See how you stack up against cloud learners globally. Filter rankings by scores and milestones.',
      Icon: Trophy,
      color: 'text-google-yellow bg-google-yellow/10 border-google-yellow/10'
    },
    {
      title: 'Admin point configurations',
      description: 'Point policies can be dynamically modified by platform admins as new Arcade events launch.',
      Icon: ShieldAlert,
      color: 'text-google-red bg-google-red/10 border-google-red/10'
    }
  ];

  const faqs = [
    {
      q: 'How does profile scraping work?',
      a: 'When you input your Google Cloud Skills Boost public profile URL (e.g. https://www.cloudskillsboost.google/public_profiles/xxx), our system fetches the public page, analyzes the badges listed, counts the quests and skill badges, and runs the math against the current points config.'
    },
    {
      q: 'Where do I find my public profile URL?',
      a: 'Log in to Google Cloud Skills Boost, click on your profile icon in the top right, navigate to "Profile", enable "Make Profile Public", and copy the public profile link generated.'
    },
    {
      q: 'What are the default point values?',
      a: 'The default configuration awards 1 point per standard Lab/Quest and 2 points per completed Skill Badge. Admin parameters can change this instantly as rules shift.'
    },
    {
      q: 'Is my history saved?',
      a: 'Yes, if you sign up and log in, saving any calculation maps it into your private dashboard logs so you can monitor your progression graphs.'
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pb-12">
      
      {/* Premium background mesh elements */}
      <div className="absolute top-1/4 left-1/4 -z-10 w-96 h-96 rounded-full bg-google-blue/5 filter blur-3xl animate-blob-1" />
      <div className="absolute top-1/2 right-1/4 -z-10 w-80 h-80 rounded-full bg-google-green/5 filter blur-3xl animate-blob-2" />
      <div className="absolute bottom-1/4 left-1/3 -z-10 w-96 h-96 rounded-full bg-google-yellow/5 filter blur-3xl animate-blob-3" />

      {/* Hero Section */}
      <section className="text-center py-16 sm:py-24 max-w-4xl mx-auto px-4">
        
        {/* Animated tag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-google-blue/15 bg-google-blue/5 text-google-blue text-xs font-bold mb-6"
        >
          <Award className="w-3.5 h-3.5" />
          <span>New Arcade Tracking features live!</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100"
        >
          Google Cloud Arcade <span className="text-gradient-google">Progress Tracker</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed"
        >
          Analyze your public skills profile instantly, calculate points, monitor swag milestones, and check where you rank on the community leaderboards.
        </motion.p>

        {/* Profile Search Input form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleScrape}
          className="mt-10 max-w-xl mx-auto flex flex-col sm:flex-row gap-3 bg-white/60 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-md"
        >
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-3 w-5 h-5 text-slate-400" />
            <input
              type="url"
              placeholder="Paste Skills Boost Public Profile URL (or type 'mock')"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-transparent outline-none border-0 text-sm text-slate-800 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="sm:w-auto py-2.5 px-6 rounded-xl bg-google-blue hover:bg-blue-600 text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Calculate Progress
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </motion.form>

        {error && (
          <p className="text-xs text-google-red font-bold mt-4 text-center">{error}</p>
        )}
      </section>

      {/* Features cards grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-center text-slate-800 dark:text-white mb-10">Platform Features</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, idx) => {
            const { Icon } = f;
            return (
              <div key={idx} className="glass-card p-6 border border-slate-200/50 dark:border-slate-800/50 hover-lift">
                <div className={`p-3 rounded-2xl w-fit ${f.color} border`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-4">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scrape results evaluation modal dialog popup */}
      <AnimatePresence>
        {scrapedData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl glass-card p-6 shadow-2xl overflow-hidden"
            >
              <h2 className="text-base font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-850 pb-3">
                Scanned Profile Details
              </h2>
              
              <div className="py-4 space-y-4 text-xs font-semibold">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">PROFILE OWNER</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block">{scrapedData.name}</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 text-center">
                  <div className="p-3 bg-google-green/10 border border-google-green/10 text-google-green rounded-xl">
                    <span className="text-[10px] text-slate-450 block uppercase">Standard Quests</span>
                    <span className="text-xl font-bold mt-1 block">{scrapedData.labsCount}</span>
                  </div>

                  <div className="p-3 bg-google-yellow/10 border border-google-yellow/10 text-google-yellow rounded-xl">
                    <span className="text-[10px] text-slate-450 block uppercase">Skill Badges</span>
                    <span className="text-xl font-bold mt-1 block">{scrapedData.badgesCount}</span>
                  </div>

                  <div className="p-3 bg-google-blue/10 border border-google-blue/10 text-google-blue rounded-xl">
                    <span className="text-[10px] text-slate-450 block uppercase">Estimated Score</span>
                    <span className="text-xl font-bold mt-1 block">{calculatePoints(scrapedData.labsCount, scrapedData.badgesCount)} pts</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block uppercase">Estimated Milestone</span>
                  <span className="text-xs font-bold text-google-red mt-1 block">
                    {getMilestoneReached(calculatePoints(scrapedData.labsCount, scrapedData.badgesCount))}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-3 border-t border-slate-200 dark:border-slate-850">
                <button
                  onClick={() => setScrapedData(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-250 dark:border-slate-750 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850 transition-all"
                >
                  Close
                </button>
                
                <button
                  onClick={handleSaveScraped}
                  disabled={saving || saveSuccess}
                  className="flex-1 py-2 rounded-xl bg-google-blue text-white text-xs font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-1.5 shadow-sm"
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
                      {user ? 'Save to History' : 'Login to Save'}
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
        <h2 className="text-xl font-bold text-center text-slate-800 dark:text-white mb-8">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850/80 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center p-5 text-left text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 outline-none"
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
                    <p className="p-5 pt-0 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-850">
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
      <footer className="text-center mt-16 pt-8 border-t border-slate-200 dark:border-slate-850 max-w-6xl mx-auto px-4 text-[10px] text-slate-400 space-y-2">
        <p>© 2026 Points Calculator. Independent community tool. Not affiliated with Google LLC.</p>
        <p>Google Cloud, Google Cloud Skills Boost, and Google Cloud Arcade are trademarks of Google LLC.</p>
      </footer>

    </div>
  );
};
export default Home;
