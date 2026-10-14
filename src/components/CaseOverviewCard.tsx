import React from 'react';
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  ChevronRight, 
  HelpCircle, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { Case, CaseEvent, AIExplanation, LanguageCode } from '../types';
import { MULTILINGUAL_TRANSLATIONS } from '../data/mockDatabase';

interface CaseOverviewCardProps {
  caseData: Case;
  latestEvent?: CaseEvent;
  explanation?: AIExplanation;
  onViewTimeline: () => void;
  onViewOrders: () => void;
  ordersCount: number;
  onExplainEvent: (event: CaseEvent) => void;
  onSpeak: (text: string) => void;
  language: LanguageCode;
}

export const CaseOverviewCard: React.FC<CaseOverviewCardProps> = ({
  caseData,
  latestEvent,
  explanation,
  onViewTimeline,
  onViewOrders,
  ordersCount,
  onExplainEvent,
  onSpeak,
  language
}) => {
  const t = MULTILINGUAL_TRANSLATIONS[language]?.['general'] || MULTILINGUAL_TRANSLATIONS.en['general'];

  const noUpdates = 'No case updates have been published for this case yet.';
  const speechContent = latestEvent
    ? `${t.recentUpdate}. ${t.whatHappenedTitle} ${explanation?.what_happened || latestEvent.officialText}. ${t.whatItMeansTitle} ${explanation?.what_it_means || ''}. ${t.actionTitle} ${explanation?.action_required || ''}. ${t.importantDateTitle} ${caseData.nextHearingDate || 'None specified'}.`
    : `${noUpdates} ${t.importantDateTitle} ${caseData.nextHearingDate || 'None specified'}.`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200 font-bold text-xs rounded-md uppercase tracking-wider border border-blue-100 dark:border-blue-900">
                {caseData.caseType}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {caseData.status}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                CNR: {caseData.cnr}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {caseData.caseNumber}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
              {caseData.court}, {caseData.district}, {caseData.state}
            </p>
          </div>

          {/* Quick Date Highlights */}
          <div className="flex items-center gap-3">
            <div className="p-4 bg-blue-50 dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-slate-700 shadow-2xs">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Next Hearing
              </div>
              <div className="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-4 h-4" />
                {caseData.nextHearingDate || 'To be notified'}
              </div>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs hidden sm:block">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Filing Date
              </div>
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                {caseData.filingDate}
              </div>
            </div>
          </div>
        </div>

        {/* Litigant & Subject Information Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-200 dark:border-slate-700/60 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Petitioner (Plaintiff):</span>
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">{caseData.petitioner}</strong>
            <span className="text-slate-400 block text-[11px]">Advocate: {caseData.petitionerAdvocate}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Respondent (Defendant):</span>
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">{caseData.respondent}</strong>
            <span className="text-slate-400 block text-[11px]">Advocate: {caseData.respondentAdvocate}</span>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Law & Subject:</span>
            <p className="text-slate-700 dark:text-slate-300 line-clamp-2">{caseData.subject}</p>
          </div>
        </div>
      </div>

      {/* Latest Update & What It Means (Citizen-First Card) */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t.recentUpdate} ({latestEvent?.eventDate || 'Latest'})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="read-overview-audio-btn"
              onClick={() => onSpeak(speechContent)}
              title="Listen to summary audio"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Read Aloud</span>
            </button>

            {latestEvent && (
              <button
                id="inspect-latest-event-btn"
                onClick={() => onExplainEvent(latestEvent)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Inspect Official Details
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4 Prominent Citizen Answers */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Card 1: What happened? */}
          <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-blue-950 dark:text-blue-200 font-extrabold text-sm uppercase tracking-wide">
              <HelpCircle className="w-4 h-4 text-blue-800 dark:text-blue-300" />
              <span>{t.whatHappenedTitle}</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {explanation?.what_happened || latestEvent?.officialText || noUpdates}
            </p>
          </div>

          {/* Card 2: What does it mean? */}
          <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-blue-950 dark:text-blue-200 font-extrabold text-sm uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-teal-700 dark:text-teal-300" />
              <span>{t.whatItMeansTitle}</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {explanation?.what_it_means || 'The available case information does not specify this.'}
            </p>
          </div>

          <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-blue-950 dark:text-blue-200 font-extrabold text-sm uppercase tracking-wide">
              <Calendar className="w-4 h-4 text-blue-800 dark:text-blue-300" />
              <span>{t.whatNextTitle}</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {explanation?.what_happens_next || (caseData.nextHearingDate ? `The next listed date is ${caseData.nextHearingDate}.` : 'The available case information does not specify this.')}
            </p>
          </div>

          {/* Card 3: Do you need to act? */}
          <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-blue-950 dark:text-blue-200 font-extrabold text-sm uppercase tracking-wide">
              <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-300" />
              <span>{t.actionTitle}</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {explanation?.action_required || 'The available case information does not specify an action required from you.'}
            </p>
          </div>
        </div>

        {/* Verification & Trust Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>{explanation?.source === 'fallback' ? 'Rule-based summary:' : 'Grounded AI Explanation:'}</strong> {explanation?.confidence_note || (latestEvent ? 'Verified against court bench record' : 'No published record yet')} • {t.disclaimerText}
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">Synthetic Mock Data</span>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            id="view-full-timeline-btn"
            onClick={onViewTimeline}
            className="w-full sm:w-auto min-h-11 px-6 py-3 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <span>Inspect Full Chronological Timeline</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="view-orders-sheets-btn"
            onClick={onViewOrders}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>View Court Order Sheets ({ordersCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
