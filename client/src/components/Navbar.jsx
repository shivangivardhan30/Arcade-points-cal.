import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Cloud, Menu, X, Plus } from 'lucide-react';
import { AddProfileModal } from './AddProfileModal';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Milestones', path: '/milestones' },
    { label: 'Leaderboard', path: '/leaderboard' },
    { label: 'Resources', path: '/resources' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#111A2E] border-b border-[#1E2A44]">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 max-w-6xl mx-auto">
          
          {/* Brand Title */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600 text-white shadow group-hover:bg-blue-500 transition-colors">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base tracking-tight font-black text-[#E6EAF2]">
                Arcade <span className="text-[#4285F4]">Points Calculator</span>
              </span>
              <span className="text-[9px] font-medium text-[#94A3B8]">
                Unofficial community tool
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `transition-colors py-1 ${
                    isActive ? 'text-[#4285F4] border-b-2 border-[#4285F4] font-bold' : 'text-[#94A3B8] hover:text-[#E6EAF2]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Add Profile Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#4285F4] hover:bg-blue-500 text-white font-semibold text-xs shadow transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Profile</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#0B1220] hover:bg-[#1E2A44] border border-[#1E2A44] text-[#E6EAF2] md:hidden transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Thin 4-segment Google brand strip under navbar */}
        <div className="brand-strip">
          <div className="brand-strip-blue" />
          <div className="brand-strip-red" />
          <div className="brand-strip-yellow" />
          <div className="brand-strip-green" />
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#1E2A44] bg-[#111A2E] px-4 py-4 space-y-3 text-xs font-semibold">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-xl transition-colors ${
                      isActive ? 'bg-blue-500/10 text-[#4285F4] font-bold' : 'hover:bg-[#0B1220] text-[#E6EAF2]'
                    }`
                  }
                >
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="pt-2 border-t border-[#1E2A44]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#4285F4] hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Profile</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Add Profile Modal */}
      <AddProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Navbar;
