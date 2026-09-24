import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Award, ShieldAlert, X, ChevronRight, Home, BookOpen, Settings, Layers, Calculator } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const links = [
    { name: 'Overview', path: '/', Icon: Home },
    { name: 'Calculator', path: '/#calculator', Icon: Calculator },
    { name: 'Points Breakdown', path: '/dashboard', Icon: LayoutDashboard },
    { name: 'Badges Tracker', path: '/#badges', Icon: Layers },
    { name: 'Milestones', path: '/milestones', Icon: Award },
    { name: 'Resources', path: '/resources', Icon: BookOpen },
    { name: 'Settings', path: '/settings', Icon: Settings },
  ];

  if (user && user.role === 'admin') {
    links.push({ name: 'Admin Console', path: '/admin', Icon: ShieldAlert });
  }

  const activeStyle = 'bg-blue-500/10 text-blue-400 border-r-4 border-blue-500 font-bold';
  const inactiveStyle = 'text-slate-400 hover:bg-[#0b1f33]/60 hover:text-slate-200';

  const menuItems = (
    <nav className="flex-1 space-y-1.5 px-3 py-6">
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
              <Icon className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{link.name}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-[#050b14] border-r border-[#123a63]/50 transition-transform duration-300 lg:sticky lg:top-16 lg:z-30 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#123a63]/50 px-6 lg:hidden">
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Navigation</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#0b1f33] text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu List */}
        {menuItems}

        {/* Community Tool Footer Label */}
        <div className="p-4 border-t border-[#123a63]/50">
          <div className="p-3.5 rounded-2xl bg-[#0b1f33]/60 border border-[#123a63] text-center space-y-1">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
              Google Cloud Arcade
            </h4>
            <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
              Unofficial Community Points Calculator & Milestone Progress Tracker.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
