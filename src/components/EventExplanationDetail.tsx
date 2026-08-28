import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  Clock, 
  AlertCircle, 
  Calendar, 
  FileText, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Scale, 
  Check, 
  Info,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Case, CaseEvent, Order, AIExplanation, LanguageCode } from '../types';
import { MULTILINGUAL_TRANSLATIONS } from '../data/mockDatabase';

interface EventExplanationDetailProps {
  event: CaseEvent;
  caseData: Case;
  order?: Order;
  explanation?: AIExplanation;
  onBack: () => void;
  onViewOrder: (order: Order) => void;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  onRegenerateExplanation: (eventId: string, lang: string) => Promise<void>;
  language: LanguageCode;
}

export const EventExplanationDetail: React.FC<EventExplanationDetailProps> = ({
  event,
  caseData,
  order,
  explanation,
  onBack,
  onViewOrder,
  onSpeak,
  isSpeaking,
  onRegenerateExplanation,
  language
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [simplifiedLevel, setSimplifiedLevel] = useState<'standard' | 'simple'>('standard');
  const t = MULTILINGUAL_TRANSLATIONS[language]?.['general'] || MULTILINGUAL_TRANSLATIONS.en['general'];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRegenerateExplanation(event.id, language);
    } finally {
      setIsRefreshing(false);
    }
  };

  const isUnavailable = explanation?.source === 'unavailable';
  const explanationTextToRead = `${t.whatHappenedTitle} ${explanation?.what_happened}. ${t.whatItMeansTitle} ${explanation?.what_it_means}. ${t.whatNextTitle} ${explanation?.what_happens_next}. ${t.actionTitle} ${explanation?.action_required}. ${t.importantDateTitle}: ${explanation?.important_date}.`;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            id="back-from-event-detail-btn"
            onClick={onBack}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
                {event.eventType}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {event.eventDate}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Event Understanding & Record
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Read Aloud Button */}
          <button
            id="event-detail-read-aloud-btn"
            onClick={() => onSpeak(explanationTextToRead)}
            className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-500 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? 'Stop Reading' : 'Read Aloud'}</span>
          </button>

          {/* Refresh AI Explanation */}
          <button
            id="refresh-ai-explanation-btn"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title="Re-run Grounded AI Explanation"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main 2-Section Grid (Official Record vs. Citizen Explanation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SECTION A: Official Record (4 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                {t.officialRecordTitle}
              </h3>
            </div>
            <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400">
              Raw Court Entry
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Court Bench:</span>
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">{caseData.court}</strong>
            </div>

            <div>
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Event Date:</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">{event.eventDate}</span>
            </div>

            {/* Official Verbatim Text Box */}
            <div>
              <span className="text-slate-500 dark:text-slate-400 block font-medium mb-1">Official Court Entry Text:</span>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                "{event.officialText}"
              </div>
            </div>

            <div>
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Recorded By:</span>
              <span className="text-slate-700 dark:text-slate-300">{event.createdBy} ({event.publishedAt})</span>
            </div>

            {event.nextHearingDate && (
              <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider block">
                  Next Listed Hearing Date
                </span>
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300 mt-0.5 block">
                  {event.nextHearingDate}
                </span>
              </div>
            )}

            {order && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  id="inspect-attached-order-sheet-btn"
                  onClick={() => onViewOrder(order)}
                  className="w-full p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <div className="text-left">
                      <div className="text-xs font-bold">Attached Order Sheet</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{order.title}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SECTION B: Explained for You (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-200 dark:border-indigo-800/80 shadow-lg shadow-indigo-500/5 p-6 sm:p-8 space-y-6">
          {/* Section B Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 dark:border-indigo-900/40 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  {t.explainedForYouTitle}
                </h3>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  Plain-Language Citizen Breakdown
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setSimplifiedLevel('standard')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  simplifiedLevel === 'standard'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setSimplifiedLevel('simple')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  simplifiedLevel === 'simple'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Super Simple
              </button>
            </div>
          </div>

          {isUnavailable && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm font-semibold text-amber-900 dark:text-amber-100">
              AI explanation unavailable right now. The supplied record is still available in Section A.
            </div>
          )}

          {/* 4 Core Plain-Language Answer Boxes */}
          <div className="space-y-4">
            {/* Box 1: What happened? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>{t.whatHappenedTitle}</span>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {explanation?.what_happened || 'The hearing took place, but the case was not finally decided.'}
              </p>
            </div>

            {/* Box 2: What does it mean? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-sm">
                <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t.whatItMeansTitle}</span>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {explanation?.what_it_means || 'The respondent\'s lawyer asked for more time to submit written arguments.'}
              </p>
            </div>

            {/* Box 3: What's next? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 space-y-1.5">
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold text-sm">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{t.whatNextTitle}</span>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {explanation?.what_happens_next || 'The case is listed again for final arguments on 14 September 2026.'}
              </p>
            </div>

            {/* Box 4: Do you need to act? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{t.actionTitle}</span>
              </div>
              <p className="text-sm text-slate-900 dark:text-amber-100 leading-relaxed font-semibold">
                {explanation?.action_required || 'The available case information does not specify an action required from you.'}
              </p>
            </div>
          </div>

          {/* Important Date & Safety Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>{t.importantDateTitle}:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold font-mono">
                  {explanation?.important_date || event.nextHearingDate || 'None specified'}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Grounded in the supplied case record • Not legal advice</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-700/60 pt-2">
              <strong>Trust Notice:</strong> {t.disclaimerText} Based strictly on the official case information shown above.
              {explanation?.uncertainty_note ? ` ${explanation.uncertainty_note}` : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
