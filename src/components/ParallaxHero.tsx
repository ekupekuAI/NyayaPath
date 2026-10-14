import React, { useState } from 'react';
import { Search, ArrowRight, CheckCircle2, ShieldCheck, Clock, FileCheck, Scale } from 'lucide-react';
import { LanguageCode } from '../types';
import { MULTILINGUAL_TRANSLATIONS } from '../data/mockDatabase';

interface ParallaxHeroProps {
  onSelectCase: (caseId: string) => void;
  onSearch: (query: string) => boolean;
  language: LanguageCode;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({ onSelectCase, onSearch, language }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notFound, setNotFound] = useState(false);
  const t = MULTILINGUAL_TRANSLATIONS[language]?.['general'] || MULTILINGUAL_TRANSLATIONS.en['general'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setNotFound(!onSearch(searchQuery.trim()));
    } else {
      onSelectCase('case-cs-184-2024');
    }
  };

  return (
    <section className="relative overflow-hidden pt-7 pb-12 lg:pt-10 lg:pb-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 text-blue-950 dark:text-blue-200 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-800 dark:text-blue-300" />
            <span>Independent Citizen Prototype - 100% Synthetic Demo Data</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Your case. Finally understandable.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Understand case updates, follow the timeline, and see what the available record says happens next.
          </p>

          {/* Instant Search Bar & CTA */}
          <div className="pt-4 max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="relative flex-1 flex items-center pl-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  id="cnr-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setNotFound(false);
                  }}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-3 pr-4 py-3 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button
                id="search-case-submit-btn"
                type="submit"
                className="min-h-11 px-6 py-3 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>{t.searchButton}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {notFound && (
              <p role="alert" className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-300">
                No synthetic case matches "{searchQuery.trim()}". Try a demo CNR, case number, party name or court below.
              </p>
            )}

            {/* Quick Demo Case Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Quick Demo Samples:</span>
              <button
                id="chip-demo-case-184"
                onClick={() => onSelectCase('case-cs-184-2024')}
                className="min-h-11 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-800 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-slate-700 font-semibold transition-all shadow-2xs flex items-center gap-1.5"
              >
                <Scale className="w-3.5 h-3.5 text-indigo-500" />
                Civil Suit 184/2024 (Hyderabad)
              </button>
              <button
                id="chip-demo-case-92"
                onClick={() => onSelectCase('case-rc-92-2024')}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold transition-all shadow-2xs"
              >
                Rent Suit 92/2024 (Mumbai)
              </button>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-sm transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Plain-Language Meaning</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Legal jargon like "rejoinder", "cross-examination", and "matter posted" translated into everyday language.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-sm transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Clear Next Actions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Instantly answers: <em>Do I need to do anything?</em> and displays confirmed hearing dates prominently.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-sm transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Record-Grounded Safety</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Uses supplied records only. Never predicts case results, invents facts, or gives legal advice.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-sm transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Timeline-First Journey</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              A clean chronological story from filing to registration, evidence, arguments, and final disposal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
