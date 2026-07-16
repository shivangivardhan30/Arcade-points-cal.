import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calculator, History, ShieldAlert, X, ChevronRight, Trophy, GraduationCap, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const links = [
    { name: 'Home Tracker', path: '/', Icon: Home },
    { name: 'Dashboard', path: '/dashboard', Icon: LayoutDashboard },
    { name: 'Calculator', path: '/calculator', Icon: Calculator },
    { name: 'History', path: '/history', Icon: History },
    { name: 'Leaderboard', path: '/leaderboard', Icon: Trophy },
    { name: 'Resources', path: '/resources', Icon: GraduationCap },
  ];

  if (user && user.role === 'admin') {
    links.push({ name: 'Admin Panel', path: '/admin', Icon: ShieldAlert });
  }

  const activeStyle = 'bg-google-blue/10 dark:bg-google-blue/20 text-google-blue border-r-4 border-google-blue font-semibold';
  const inactiveStyle = 'text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60';

  const menuItems = (
    <nav className="flex-1 space-y-1 px-3 py-6">
      {links.map((link) => {
        const { Icon } = link;
        return (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 text-sm ${
                isActive ? activeStyle : inactiveStyle
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{link.name}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-all duration-300"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-850/80 transition-transform duration-300 lg:sticky lg:top-16 lg:z-30 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header (Mobile Drawer Only) */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-850 px-6 lg:hidden">
          <span className="text-base font-bold text-slate-800 dark:text-slate-200">Arcade Navigation</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Menu Items */}
        {menuItems}

        {/* Bottom Panel */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-850/80">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-google-blue/10 to-google-green/10 dark:from-google-blue/5 dark:to-google-green/5 border border-google-blue/10 text-center">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350">Points Calculator</h4>
            <p className="text-[10px] mt-1 text-slate-500 dark:text-slate-400">
              Track achievements, compare leaderboard scores, and share cloud badges.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
