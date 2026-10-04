import React, { useState, useEffect } from 'react';
import {
  Layers,
  Compass,
  Shuffle,
  AlertCircle,
  Search,
  LayoutDashboard,
  Menu,
  X,
  CheckCircle2,
} from 'lucide-react';
import { getOverallProgressStats } from '../services/storageService';

export function Navbar({ activeRoute, navigate }) {
  const [stats, setStats] = useState(getOverallProgressStats());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const refreshStats = () => {
    setStats(getOverallProgressStats());
  };

  useEffect(() => {
    refreshStats();
    const handleUpdate = () => refreshStats();
    window.addEventListener('tf_progress_updated', handleUpdate);
    return () => window.removeEventListener('tf_progress_updated', handleUpdate);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'exams', label: 'Exams', icon: Layers },
    { id: 'objectives', label: 'Objectives', icon: Compass },
    { id: 'random', label: 'Random Quiz', icon: Shuffle },
    {
      id: 'review',
      label: 'Incorrect',
      icon: AlertCircle,
      badge: stats.incorrectCount > 0 ? stats.incorrectCount : null,
    },
    { id: 'questions', label: 'Search', icon: Search },
  ];

  const handleNavClick = (route) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-15">
          {/* Brand with Official Terraform Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => handleNavClick('dashboard')}
          >
            <img
              src="./terraform-logo.png"
              alt="Terraform Logo"
              className="w-8 h-8 object-contain rounded-md group-hover:scale-105 transition-transform"
            />
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-slate-900 text-base tracking-tight">Terraform</span>
              <span className="text-xs font-semibold text-indigo-600 font-mono">004</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute.startsWith(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-xs font-bold px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Quick Progress Badge */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
              title="Click to view full dashboard progress"
            >
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
              <span className="hidden sm:inline text-slate-900 font-semibold">{stats.answeredCount}/{stats.totalQuestions}</span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="text-indigo-600 font-bold">{stats.overallPercentage}%</span>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 md:hidden rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute.startsWith(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
