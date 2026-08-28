import React, { useState } from 'react';
import { 
  Scale, 
  UserCheck, 
  Send, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  FileText, 
  Sparkles, 
  AlertCircle,
  Eye,
  ShieldAlert,
  ArrowRight,
  Database
} from 'lucide-react';
import { Case, CaseEvent, EventType, User } from '../types';
import { DEMO_USERS } from '../data/mockDatabase';

interface CourtStaffPortalProps {
  cases: Case[];
  selectedCase: Case;
  onSelectCase: (c: Case) => void;
  onCreateCase: (caseData: Omit<Case, 'id'>) => Case;
  onPublishEvent: (caseId: string, eventData: {
    eventType: EventType;
    eventDate: string;
    officialText: string;
    nextHearingDate?: string;
    status: 'Published' | 'Draft';
  }) => Promise<void>;
  onSwitchToCitizenView: () => void;
}

export const CourtStaffPortal: React.FC<CourtStaffPortalProps> = ({
  cases,
  selectedCase,
  onSelectCase,
  onCreateCase,
  onPublishEvent,
  onSwitchToCitizenView
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [staffUser] = useState<User>(DEMO_USERS[0]);

  // Form State
  const [eventType, setEventType] = useState<EventType>('Judgment Reserved');
  const [eventDate, setEventDate] = useState<string>('28 August 2026');
  const [officialText, setOfficialText] = useState<string>(
    'Rejoinder submissions filed. Matter reserved for judgment.'
  );
  const [nextHearingDate, setNextHearingDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [caseSuccess, setCaseSuccess] = useState(false);
  const [newCase, setNewCase] = useState({
    cnr: 'DEMO-CNR-NEW-001-2026',
    caseNumber: 'DEMO-CIV-NEW-001-2026',
    caseType: 'Original Civil Suit (OS)',
    court: 'Demo District Court, Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    filingDate: '28 August 2026',
    status: 'Active' as const,
    nextHearingDate: '',
    petitioner: 'Asha Rao (Fictional Party)',
    petitionerAdvocate: 'Adv. Demo Petitioner',
    respondent: 'Vikram Sen (Fictional Party)',
    respondentAdvocate: 'Adv. Demo Respondent',
    actSection: 'Synthetic civil proceeding',
    subject: 'Synthetic contract dispute for demonstration'
  });

  const eventTypeOptions: EventType[] = [
    'Oral Arguments',
    'Final Arguments Listed',
    'Interlocutory Order',
    'Evidence Hearing',
    'Written Statement Filed',
    'Issues Framed',
    'Notice Issued',
    'Rejoinder Submissions',
    'Judgment Reserved'
  ];

  const handleCreateCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = onCreateCase(newCase);
    setCaseSuccess(true);
    setTimeout(() => setCaseSuccess(false), 4000);
    setNewCase(prev => ({
      ...prev,
      cnr: `DEMO-CNR-NEW-${Math.floor(Math.random() * 900 + 100)}-2026`,
      caseNumber: `DEMO-CIV-NEW-${Math.floor(Math.random() * 900 + 100)}-2026`
    }));
    setEventType('Case Filing');
    setEventDate(created.filingDate);
    setOfficialText('Plaint presented before registry. Scrutiny initiated.');
    setNextHearingDate(created.nextHearingDate);
  };

  const handleTemplateSelect = (text: string, type: EventType, nextDate: string) => {
    setOfficialText(text);
    setEventType(type);
    setNextHearingDate(nextDate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officialText.trim()) return;

    setIsSubmitting(true);
    setPublishSuccess(false);

    try {
      await onPublishEvent(selectedCase.id, {
        eventType,
        eventDate,
        officialText,
        nextHearingDate: nextHearingDate || undefined,
        status: 'Published'
      });
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Staff Header & Warning Banner */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-900 flex items-center justify-center text-white shadow-sm">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold">Court Operations Demo Portal</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Staff Role
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Synthetic internal interface demonstrating how authorized registry/bench staff publish structured case events.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-slate-800 rounded-xl border border-slate-700 text-xs">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-white font-semibold block">{staffUser.name}</span>
              <span className="text-slate-400 text-[11px]">{staffUser.designation}</span>
            </div>
          </div>
        </div>

        <a
          href="#staff-add-event-form"
          className="inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 text-sm font-bold hover:bg-slate-100 transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-indigo-600" />
          Add Event
        </a>
        <a
          href="#staff-create-case-form"
          className="ml-2 inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Case
        </a>

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Demo Safety Notice:</strong> Changes made here only affect the local synthetic session. No actual court servers are touched.
          </span>
        </div>
      </div>

      {/* Main Operations Split (Queue vs Add Event Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Case Selector & Operational Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Cases in Current Bench List
          </h3>

          <div className="space-y-3">
            {cases.map((c) => {
              const isSelected = selectedCase.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectCase(c)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 ring-1 ring-indigo-500/20 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {c.caseNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                      {c.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                    {c.petitioner.split(' ')[0]} vs. {c.respondent.split(' ')[0]}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {c.court}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>CNR: {c.cnr.substring(0, 8)}...</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">Manage Case</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Operational Metrics */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-slate-700 dark:text-slate-300">Today's Daily Board Statistics</h4>
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Cases listed today:</span>
              <strong className="text-slate-800 dark:text-slate-200">18 cases</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Updates published:</span>
              <strong className="text-emerald-600 dark:text-emerald-400">14 published</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 dark:text-slate-400">Drafts pending scrutiny:</span>
              <strong className="text-amber-600 dark:text-amber-400">4 pending</strong>
            </div>
          </div>
        </div>

        {/* Right Side: Add Case Event Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
        <div id="staff-create-case-form" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5 scroll-mt-28">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Create New Synthetic Case
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Creates a separate case record. Events published after selection attach to that case only.
              </p>
            </div>
            {caseSuccess && <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold">New case selected</span>}
          </div>
          <form onSubmit={handleCreateCaseSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['caseNumber', 'Case Number'],
              ['cnr', 'CNR'],
              ['petitioner', 'Petitioner'],
              ['respondent', 'Respondent'],
              ['court', 'Court'],
              ['filingDate', 'Filing Date'],
              ['nextHearingDate', 'Next Hearing Date'],
              ['subject', 'Subject']
            ].map(([key, label]) => (
              <label key={key} className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {label}
                <input
                  value={(newCase as any)[key]}
                  onChange={(e) => setNewCase(prev => ({ ...prev, [key]: e.target.value }))}
                  className="mt-1 w-full min-h-11 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required={key !== 'nextHearingDate'}
                />
              </label>
            ))}
            <button type="submit" className="sm:col-span-2 min-h-11 px-6 py-3 bg-blue-900 dark:bg-blue-800 hover:bg-blue-800 dark:hover:bg-blue-700 text-white font-bold text-sm rounded-lg">
              Create Case & Select It
            </button>
          </form>
        </div>

        <div id="staff-add-event-form" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Add & Publish Case Event
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Target Case: <strong>{selectedCase.caseNumber}</strong> ({selectedCase.cnr})
              </p>
            </div>

            {publishSuccess && (
              <div className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Published Live to Citizen Portal!
              </div>
            )}
          </div>

          {/* Quick Pre-Fill Templates */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Quick Event Templates (Court Bench Presets):
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleTemplateSelect(
                  'Rejoinder submissions filed. Matter reserved for judgment.',
                  'Judgment Reserved',
                  ''
                )}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
              >
                + Arguments Concluded / Reserved
              </button>
              <button
                type="button"
                onClick={() => handleTemplateSelect(
                  'Counsel for respondent seeks short adjournment due to illness. Granted on condition of filing written arguments by 10.09.2026.',
                  'Oral Arguments',
                  '18 September 2026'
                )}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
              >
                + Adjournment Requested
              </button>
              <button
                type="button"
                onClick={() => handleTemplateSelect(
                  'Interim order of status quo extended till next date of hearing. Matter posted for final disposal.',
                  'Interlocutory Order',
                  '22 September 2026'
                )}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
              >
                + Interim Status Quo Order
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event / Proceeding Type *
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {eventTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event / Hearing Date *
                </label>
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="e.g. 02 September 2026"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Court Entry Text (Verbatim Record) *
              </label>
              <textarea
                rows={4}
                value={officialText}
                onChange={(e) => setOfficialText(e.target.value)}
                placeholder="Enter official bench notes or order summary text..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Next Scheduled Hearing Date (if posted)
                </label>
                <input
                  type="text"
                  value={nextHearingDate}
                  onChange={(e) => setNextHearingDate(e.target.value)}
                  placeholder="e.g. 14 September 2026"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bench / Author
                </label>
                <input
                  type="text"
                  disabled
                  value="K. Sridevi (Court Hall 4)"
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Publishing Action */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>AI explanation service will automatically ground this update upon publish.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-h-11 px-6 py-3 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Send className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>{isSubmitting ? 'Publishing & Generating AI...' : 'Publish Update to Portal'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quick Check CTA */}
          <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-indigo-900 dark:text-indigo-300 font-medium">
              Want to see how citizens experience this update?
            </span>
            <button
              onClick={onSwitchToCitizenView}
              className="px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>View Citizen Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
