import React, { useState, useEffect } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, Menu, User as UserIcon, CloudLightning, Bell, LogIn, Chrome } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = ({ onMenuClick }) => {
  const { user, logout, login } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

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
          if (data.length > 0) {
            setHasUnread(true);
          }
        }
      } catch (err) {
        console.error('Failed to load alerts', err);
      }
    };
    fetchNotices();
  }, [user]);

  // Mock Google Login
  const handleGoogleLogin = async () => {
    try {
      // Mock login via the general auth context by logging in with predefined credentials
      await login('admin@arcade.com', 'AdminPass123!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Google Sign-In failed', err);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setHasUnread(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b shadow-sm transition-all duration-300">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Left Side: Hamburger & Logo */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-google text-white shadow-sm">
              <CloudLightning className="w-4 h-4" />
            </div>
            <span className="text-lg tracking-tight font-extrabold text-slate-800 dark:text-slate-100">
              Points<span className="text-google-blue">Calculator</span>
            </span>
          </Link>
        </div>

        {/* Right Side: Navigation actions */}
        <div className="flex items-center gap-3">
          {/* Public links when guest */}
          {!user && (
            <div className="hidden md:flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-355 mr-2">
              <Link to="/" className="hover:text-google-blue">Home</Link>
              <Link to="/leaderboard" className="hover:text-google-blue">Leaderboard</Link>
              <Link to="/resources" className="hover:text-google-blue">Resources</Link>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-105 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all duration-300"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-google-yellow" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Notifications Drawer */}
          {user && (
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="p-2.5 rounded-xl bg-slate-105 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all duration-300"
                aria-label="View Notifications"
              >
                <Bell className="w-4 h-4" />
                {hasUnread && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-google-red ring-2 ring-white dark:ring-slate-900 animate-ping" />
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto glass-card p-4 shadow-xl z-50 border border-slate-200 dark:border-slate-800"
                  >
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                      System Notifications
                    </h4>
                    {notifications.length > 0 ? (
                      <div className="space-y-3">
                        {notifications.map((n) => (
                          <div key={n._id} className="text-xs pb-2 border-b border-slate-100 dark:border-slate-900 last:border-0">
                            <h5 className="font-bold text-slate-700 dark:text-slate-300">{n.title}</h5>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 leading-normal">{n.content}</p>
                            <span className="text-[9px] text-slate-400 block mt-1">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-slate-400 text-xs py-4">No active notices.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* User profile / Login widgets */}
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden md:block text-right">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                  {user.name}
                </p>
                <p className="text-[10px] font-medium text-slate-400 capitalize">
                  {user.role} Account
                </p>
              </div>

              {/* Avatar Icon */}
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-google-blue/10 dark:bg-google-blue/20 text-google-blue border border-google-blue/20">
                <UserIcon className="w-4 h-4" />
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition-all duration-300"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Standard Email Login redirection */}
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 border border-slate-250 dark:border-slate-750 text-slate-650 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>

              {/* Mock Google OAuth Sign In */}
              <button
                onClick={handleGoogleLogin}
                className="flex items-center gap-1.5 px-4 py-2 bg-google-blue text-white font-bold text-xs rounded-xl hover:bg-blue-600 shadow-sm transition-all"
              >
                <Chrome className="w-3.5 h-3.5" />
                <span>Google Sign-In</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
export default Navbar;
