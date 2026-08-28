import React from 'react';
import { Scale, Users, Settings2, Globe, RotateCcw } from 'lucide-react';
import { LanguageCode } from '../types';

interface HeaderProps {
  activeTab: 'citizen' | 'staff';
  setActiveTab: (tab: 'citizen' | 'staff') => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  onOpenAccessibility: () => void;
  onResetDemo: () => void;
  isResetting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenAccessibility,
  onResetDemo,
  isResetting
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Product Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('citizen')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-900 flex items-center justify-center text-white shadow-sm">
              <Scale className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Nyaya<span className="text-blue-800 dark:text-blue-300">Path</span>
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-700/50">
                  Citizen Layer
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                Understand your case. Know your next step.
              </p>
            </div>
          </div>

          {/* Primary Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              id="tab-citizen-portal"
              onClick={() => setActiveTab('citizen')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'citizen'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Citizen Portal
            </button>

            <button
              id="tab-staff-portal"
              onClick={() => setActiveTab('staff')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'staff'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Scale className="w-4 h-4" />
              Court Operations Demo
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

          </nav>

          {/* Quick Actions & Accessibility Tools */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative flex items-center">
              <label htmlFor="language-select" className="sr-only">Select Language</label>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                <select
                  id="language-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                  className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer text-xs font-medium"
                >
                  <option value="en" className="dark:bg-slate-800">English</option>
                  <option value="hi" className="dark:bg-slate-800">हिन्दी (Hindi)</option>
                  <option value="te" className="dark:bg-slate-800">తెలుగు (Telugu)</option>
                  <option value="ta" className="dark:bg-slate-800">தமிழ் (Tamil)</option>
                  <option value="mr" className="dark:bg-slate-800">मराठी (Marathi)</option>
                </select>
              </div>
            </div>

            {/* Accessibility Settings Drawer Button */}
            <button
              id="header-accessibility-btn"
              onClick={onOpenAccessibility}
              title="Accessibility Settings (Font size, High contrast)"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {/* Reset Demo Button */}
            <button
              id="header-reset-demo-btn"
              onClick={onResetDemo}
              disabled={isResetting}
              title="Reset Synthetic Demo State"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              Reset Demo
            </button>
          </div>
        </div>

        {/* Mobile Subnavigation */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 gap-1">
          <button
            onClick={() => setActiveTab('citizen')}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md ${
              activeTab === 'citizen'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Citizen Portal
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md ${
              activeTab === 'staff'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Staff Operations
          </button>
        </div>
      </div>
    </header>
  );
};
