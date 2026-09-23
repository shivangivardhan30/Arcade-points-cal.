import React, { useState } from 'react';
import { Activity, Sun, Moon, Menu, X, Compass, HelpCircle, Info, Calculator, Home } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Navbar = ({ onNavigate }) => {
  const { darkMode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home', Icon: Home },
    { label: 'Calculator', href: '#calculator', Icon: Calculator },
    { label: 'How It Works', href: '#how-it-works', Icon: Compass },
    { label: 'FAQ', href: '#faq', Icon: HelpCircle },
    { label: 'About', href: '#about', Icon: Info }
  ];

  const handleLinkClick = (href) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-900/80 transition-colors duration-300">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
        
        {/* Brand Title */}
        <a href="#home" onClick={(e) => { e.preventDefault(); handleLinkClick('#home'); }} className="flex items-center gap-2.5 font-heading">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-brand text-white shadow">
            <Activity className="w-4.5 h-4.5" />
          </div>
          <span className="text-base tracking-tight font-black text-slate-900 dark:text-white">
            Points<span className="text-indigo-600 dark:text-indigo-400">Calculator</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-extrabold text-slate-600 dark:text-slate-300">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 md:hidden transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 py-4 space-y-2 text-xs font-bold animate-fade-in">
          {navLinks.map((link, idx) => {
            const { Icon } = link;
            return (
              <a
                key={idx}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Icon className="w-4 h-4 text-indigo-500" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};
