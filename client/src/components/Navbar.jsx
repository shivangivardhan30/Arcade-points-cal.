import React, { useState, useEffect } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, Menu, User as UserIcon, Activity, Bell, LogIn, Key, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AddProfileModal } from './AddProfileModal';

export const Navbar = ({ onMenuClick }) => {
  const { user, logout, login } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchNotices = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/announcements/active`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('arcade_token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
          if (data.length > 0) setHasUnread(true);
        }
      } catch (err) {
        console.error('Failed to load notices', err);
      }
    };
    fetchNotices();
  }, [user]);

  // Mock Developer Login helper for quick SaaS evaluations
  const handleDevLogin = async () => {
    try {
      await login('admin@arcade.com', 'AdminPass123!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Bypass authentication failed', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-slate-950/60 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-900/80 transition-colors duration-300">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 lg:hidden transition-colors"
              aria-label="Toggle Side Panel"
            >
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-350" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-brand text-white shadow-md">
              <Activity className="w-4.5 h-4.5" />
            </div>
            <span className="text-base tracking-tight font-extrabold text-slate-800 dark:text-white">
              CloudArc<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
            </span>
          </Link>
        </div>

        {/* Right Side: Quick Action Row */}
        <div className="flex items-center gap-3">
          
          <div className="hidden lg:flex items-center gap-6 text-xs font-extrabold text-slate-600 dark:text-slate-300 mr-4">
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
            <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Dashboard</Link>
            <Link to="/arcade-facilitator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Arcade Facilitator</Link>
            <Link to="/leaderboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Leaderboard</Link>
            <Link to="/resources" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Resources</Link>
          </div>

          {/* Add Profile Trigger */}
          <button
            onClick={() => setIsAddProfileOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Profile</span>
          </button>

          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all duration-300"
            aria-label="Toggle Theme Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Notifications alerts popup */}
          {user && (
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setHasUnread(false); }}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all duration-300"
                aria-label="Alert Messages"
              >
                <Bell className="w-4 h-4" />
                {hasUnread && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto glass-card p-4 shadow-xl z-50 border border-slate-200/80 dark:border-slate-800/80"
                  >
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                      System Notifications
                    </h4>
                    {notifications.length > 0 ? (
                      <div className="space-y-3">
                        {notifications.map((n) => (
                          <div key={n._id} className="text-[11px] pb-2 border-b border-slate-100 dark:border-slate-900 last:border-0">
                            <h5 className="font-bold text-slate-850 dark:text-slate-200">{n.title}</h5>
                            <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">{n.content}</p>
                            <span className="text-[8px] text-slate-400 block mt-1">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-slate-400 text-xs py-4 font-semibold">No active notices.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* User Sign-In Controls */}
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-850">
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                  {user.name}
                </p>
                <p className="text-[9px] font-semibold text-slate-400 capitalize">
                  {user.role} Account
                </p>
              </div>

              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 border border-indigo-500/20">
                <UserIcon className="w-4 h-4" />
              </div>

              <button
                onClick={logout}
                className="p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-450 transition-all duration-300"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 font-bold text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>

              <button
                onClick={handleDevLogin}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-brand text-white font-bold text-xs rounded-xl hover:opacity-90 shadow-md transition-all"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Dev Access</span>
              </button>
            </div>
          )}

        </div>

      </div>

      <AddProfileModal
        isOpen={isAddProfileOpen}
        onClose={() => setIsAddProfileOpen(false)}
      />
    </header>
  );
};
export default Navbar;
