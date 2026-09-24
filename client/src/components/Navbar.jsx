import React, { useState } from 'react';
import { Cloud, Sun, Moon, Menu, X, Compass, HelpCircle, Calculator, Home, Award, BookOpen, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home', Icon: Home },
    { label: 'Calculator', href: '#calculator', Icon: Calculator },
    { label: 'Progress', href: '#progress', Icon: Layers },
    { label: 'Milestones', href: '#milestones', Icon: Award },
    { label: 'Resources', href: '#resources', Icon: BookOpen },
    { label: 'FAQ', href: '#faq', Icon: HelpCircle }
  ];

  const handleLinkClick = (href) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050b14]/90 backdrop-blur-xl border-b border-[#123a63]/50 transition-colors duration-300">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
        
        {/* Brand Title & Unofficial Tag */}
        <div className="flex items-center gap-3">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleLinkClick('#home'); }}
            className="flex items-center gap-2.5 font-heading group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Cloud className="w-4.5 h-4.5 text-blue-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base tracking-tight font-black text-white">
                Arcade <span className="text-blue-400">Points Calculator</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider hidden sm:block">
                Google Cloud Arcade • Unofficial Tool
              </span>
            </div>
          </a>

          {/* UNOFFICIAL COMMUNITY TOOL Label */}
          <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
            UNOFFICIAL COMMUNITY TOOL
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-bold text-slate-300">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
              className="hover:text-blue-400 transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Theme Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-[#0b1f33] hover:bg-[#123a63] border border-[#123a63] text-slate-300 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#0b1f33] hover:bg-[#123a63] border border-[#123a63] text-slate-300 md:hidden transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#123a63] bg-[#050b14]/95 backdrop-blur-xl px-4 py-4 space-y-2 text-xs font-bold">
          <div className="px-3 py-1 mb-2">
            <span className="inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20">
              UNOFFICIAL COMMUNITY TOOL
            </span>
          </div>
          {navLinks.map((link, idx) => {
            const { Icon } = link;
            return (
              <a
                key={idx}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-[#0b1f33] text-slate-200 transition-colors"
              >
                <Icon className="w-4 h-4 text-blue-400" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
