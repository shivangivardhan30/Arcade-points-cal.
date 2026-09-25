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

  const activeStyle = 'bg-[#4285F4]/10 text-[#4285F4] border-r-4 border-[#4285F4] font-bold';
  const inactiveStyle = 'text-[#94A3B8] hover:bg-[#1E2A44]/50 hover:text-[#E6EAF2]';

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
              <Icon className="w-4 h-4 text-[#4285F4] shrink-0" />
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
          className="fixed inset-0 z-40 bg-[#0B1220]/80 backdrop-blur-sm lg:hidden transition-all duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-[#0B1220] border-r border-[#1E2A44] transition-transform duration-300 lg:sticky lg:top-16 lg:z-30 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#1E2A44] px-6 lg:hidden">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#4285F4]">Navigation</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#1E2A44] text-[#94A3B8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu List */}
        {menuItems}

        {/* Community Tool Footer Label */}
        <div className="p-4 border-t border-[#1E2A44]">
          <div className="p-3.5 rounded-2xl bg-[#111A2E] border border-[#1E2A44] text-center space-y-1">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#4285F4]">
              Google Cloud Arcade
            </h4>
            <p className="text-[9px] text-[#94A3B8] font-medium leading-relaxed">
              Unofficial Community Points Calculator & Milestone Progress Tracker.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
