import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  ChevronRight, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle, 
  CircleDot, 
  ShieldAlert,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { Case, CaseEvent, AIExplanation, LanguageCode } from '../types';
import { MULTILINGUAL_TRANSLATIONS } from '../data/mockDatabase';

interface CaseTimelineViewProps {
  caseData: Case;
  events: CaseEvent[];
  explanations: Record<string, AIExplanation>;
  onSelectEvent: (event: CaseEvent) => void;
  onBackToOverview: () => void;
  onSpeak: (text: string) => void;
  language: LanguageCode;
}

export const CaseTimelineView: React.FC<CaseTimelineViewProps> = ({
  caseData,
  events,
  explanations,
  onSelectEvent,
  onBackToOverview,
  onSpeak,
  language
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const t = MULTILINGUAL_TRANSLATIONS[language]?.['general'] || MULTILINGUAL_TRANSLATIONS.en['general'];

  const filteredEvents = events.filter(e => {
    if (filterType === 'all') return true;
    if (filterType === 'hearings') return e.eventType.includes('Hearing') || e.eventType.includes('Arguments');
    if (filterType === 'orders') return e.relatedOrderId || e.eventType.includes('Order') || e.eventType.includes('Issues');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            id="back-to-overview-btn"
            onClick={onBackToOverview}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Case Journey & Timeline
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {caseData.caseNumber} • {caseData.court}
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterType === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All Milestones ({events.length})
          </button>
          <button
            onClick={() => setFilterType('hearings')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterType === 'hearings'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Hearings Only
          </button>
          <button
            onClick={() => setFilterType('orders')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterType === 'orders'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Orders & Issues
          </button>
        </div>
      </div>

      {/* Vertical Timeline Structure */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-300 dark:before:bg-slate-700">
        {filteredEvents.map((evt, index) => {
          const isLatest = index === filteredEvents.length - 1;
          const explanation = explanations[evt.id];

          return (
            <div
              key={evt.id}
              className="relative group transition-all"
            >
              {/* Timeline Node Marker */}
              <div className={`absolute -left-[27px] sm:-left-[31px] top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-4 flex items-center justify-center transition-all ${
                isLatest
                  ? 'bg-blue-900 border-blue-200 dark:border-blue-900 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 group-hover:border-indigo-400'
              }`}>
                {isLatest ? (
                  <CircleDot className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Event Card */}
              <div 
                onClick={() => onSelectEvent(evt)}
                className={`p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer ${
                  isLatest
                    ? 'bg-white dark:bg-slate-900 border-blue-300 dark:border-blue-800 shadow-sm ring-1 ring-blue-900/10'
                    : 'bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                      {evt.eventDate}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {evt.eventType}
                    </span>
                    {isLatest && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                        Latest Update
                      </span>
                    )}
                    {evt.relatedOrderId && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Order Attached
                      </span>
                    )}
                  </div>

                  {evt.nextHearingDate && (
                    <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Next Hearing: {evt.nextHearingDate}
                    </div>
                  )}
                </div>

                {/* Plain-Language Takeaway */}
                <div className="mt-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 text-blue-800 dark:text-blue-300" />
                    <span>Citizen Explanation Takeaway</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {explanation?.summary || explanation?.what_happened || evt.officialText}
                  </p>
                </div>

                {/* Official Text Snippet */}
                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span className="truncate pr-4 italic">
                    Official note: "{evt.officialText.substring(0, 90)}..."
                  </span>
                  <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold shrink-0 group-hover:translate-x-0.5 transition-transform">
                    Inspect Both Records
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Next Scheduled Hearing Node */}
        {caseData.nextHearingDate && (
          <div className="relative pt-2">
            <div className="absolute -left-[27px] sm:-left-[31px] top-5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-4 bg-emerald-500 border-emerald-200 dark:border-emerald-900 text-white flex items-center justify-center shadow-md">
              <Clock className="w-3.5 h-3.5" />
            </div>

            <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300/60 dark:border-emerald-800/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    Upcoming Scheduled Hearing
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    Final Oral Arguments Listing
                  </h4>
                </div>
                <div className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-sm">
                  <Calendar className="w-4 h-4" />
                  {caseData.nextHearingDate}
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Both parties' counsels are scheduled to place written arguments on record and conclude final submissions before Hon'ble Presiding Officer, Bench-IV.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
