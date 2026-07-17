import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Award, ShieldAlert, X, ChevronRight, Trophy, GraduationCap, Home, BarChart3, Settings, Milestone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const links = [
    { name: 'Home Analyzer', path: '/', Icon: Home },
    { name: 'Dashboard', path: '/dashboard', Icon: LayoutDashboard },
    { name: 'Milestones', path: '/milestones', Icon: Milestone },
    { name: 'Leaderboard', path: '/leaderboard', Icon: Trophy },
    { name: 'Analytics', path: '/analytics', Icon: BarChart3 },
    { name: 'Resources', path: '/resources', Icon: GraduationCap },
    { name: 'Settings', path: '/settings', Icon: Settings },
  ];

  if (user && user.role === 'admin') {
    links.push({ name: 'Admin Console', path: '/admin', Icon: ShieldAlert });
  }

  const activeStyle = 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-r-4 border-indigo-500 font-semibold';
  const inactiveStyle = 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60';

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
              `flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 text-xs font-bold ${
                isActive ? activeStyle : inactiveStyle
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              <span>{link.name}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden transition-all duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-white dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-900/80 transition-transform duration-300 lg:sticky lg:top-16 lg:z-30 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-850 px-6 lg:hidden">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-400">Navigation</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu List */}
        {menuItems}

        {/* Premium Brand Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-900">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-indigo-500/10 text-center">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">CloudArc Pro</h4>
            <p className="text-[9px] mt-1 text-slate-500 dark:text-slate-400 leading-normal">
              SaaS dashboard tracking system. Verify user profile metrics and milestone records.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
