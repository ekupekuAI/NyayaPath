import React, { useEffect, useState } from 'react';
import { 
  DEMO_CASES, 
  INITIAL_EVENTS, 
  INITIAL_ORDERS, 
  PRECOMPUTED_EXPLANATIONS, 
  MULTILINGUAL_TRANSLATIONS 
} from './data/mockDatabase';
import { 
  Case, 
  CaseEvent, 
  Order, 
  AIExplanation, 
  LanguageCode, 
  AccessibilitySettings, 
  EventType 
} from './types';
import { Header } from './components/Header';
import { TrustBanner } from './components/TrustBanner';
import { ParallaxHero } from './components/ParallaxHero';
import { CaseOverviewCard } from './components/CaseOverviewCard';
import { CaseTimelineView } from './components/CaseTimelineView';
import { EventExplanationDetail } from './components/EventExplanationDetail';
import { OrdersDocumentViewer } from './components/OrdersDocumentViewer';
import { CourtStaffPortal } from './components/CourtStaffPortal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { createFallbackExplanation, generateAIExplanation } from './lib/aiExplanationService';

export default function App() {
  // Navigation & Surface State
  const [activeTab, setActiveTab] = useState<'citizen' | 'staff'>('citizen');
  const [citizenViewMode, setCitizenViewMode] = useState<'overview' | 'timeline' | 'event-detail' | 'orders'>('overview');
  
  // Data State
  const [cases, setCases] = useState<Case[]>(DEMO_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-cs-184-2024');
  const [events, setEvents] = useState<CaseEvent[]>(INITIAL_EVENTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [explanations, setExplanations] = useState<Record<string, AIExplanation>>(PRECOMPUTED_EXPLANATIONS);
  
  // Active selection state
  const [selectedEvent, setSelectedEvent] = useState<CaseEvent | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Modals & Accessibility State
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    highContrast: false,
    simplifiedLanguage: false,
    reducedMotion: false,
    language: 'en'
  });

  // Audio Speech Synthesis state
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  const caseEvents = events.filter(e => e.caseId === currentCase.id);
  const caseOrders = orders.filter(o => o.caseId === currentCase.id);
  const latestEvent = caseEvents[caseEvents.length - 1];
  const currentExplanation = latestEvent ? explanations[latestEvent.id] ?? createFallbackExplanation(latestEvent) : undefined;

  // Tailwind sizes are rem-based, so scaling the root font size scales the whole UI.
  useEffect(() => {
    const sizes = { normal: '100%', large: '120%', xlarge: '140%' };
    document.documentElement.style.fontSize = sizes[accessibilitySettings.fontSize];
  }, [accessibilitySettings.fontSize]);

  // Audio speech narration handler
  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    if (accessibilitySettings.language === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (accessibilitySettings.language === 'te') {
      utterance.lang = 'te-IN';
    } else if (accessibilitySettings.language === 'ta') {
      utterance.lang = 'ta-IN';
    } else if (accessibilitySettings.language === 'mr') {
      utterance.lang = 'mr-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Case Selection
  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCitizenViewMode('overview');
  };

  // CNR or Keyword Search
  const handleSearch = (query: string): boolean => {
    const q = query.trim().toLowerCase();
    const match = cases.find(c => 
      c.cnr.toLowerCase().includes(q) || 
      c.caseNumber.toLowerCase().includes(q) || 
      c.petitioner.toLowerCase().includes(q) ||
      c.court.toLowerCase().includes(q)
    );

    if (!match) return false;
    setSelectedCaseId(match.id);
    setCitizenViewMode('overview');
    return true;
  };

  // Event Selection for Detail View
  const handleSelectEvent = (event: CaseEvent) => {
    setSelectedEvent(event);
    const related = caseOrders.find(o => o.id === event.relatedOrderId);
    setSelectedOrder(related || null);
    setCitizenViewMode('event-detail');
  };

  // Order Selection
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setCitizenViewMode('orders');
  };

  // Court Staff Event Publish
  const handleCreateCase = (caseData: Omit<Case, 'id'>) => {
    const newCase: Case = {
      ...caseData,
      id: `case-${Date.now()}`
    };
    setCases(prev => [...prev, newCase]);
    setSelectedCaseId(newCase.id);
    return newCase;
  };

  const handlePublishEvent = async (caseId: string, eventData: {
    eventType: EventType;
    eventDate: string;
    officialText: string;
    nextHearingDate?: string;
    status: 'Published' | 'Draft';
  }) => {
    const targetCase = cases.find(c => c.id === caseId) || currentCase;

    const newEvent: CaseEvent = {
      id: `evt-${targetCase.id.replace('case-', '')}-${Date.now().toString().slice(-4)}`,
      caseId: targetCase.id,
      eventType: eventData.eventType,
      eventDate: eventData.eventDate,
      officialText: eventData.officialText,
      status: eventData.status,
      createdBy: 'K. Sridevi (Court Staff Demo)',
      publishedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      nextHearingDate: eventData.nextHearingDate
    };

    // Update case next hearing date
    if (eventData.nextHearingDate) {
      setCases(prev => prev.map(c => c.id === targetCase.id ? { ...c, nextHearingDate: eventData.nextHearingDate! } : c));
    }

    // Generate grounded explanation
    const generatedExp = await generateAIExplanation(newEvent, targetCase);

    setEvents(prev => [...prev, newEvent]);
    setExplanations(prev => ({
      ...prev,
      [newEvent.id]: generatedExp
    }));
  };

  // Re-generate explanation in selected language
  const handleRegenerateExplanation = async (eventId: string, lang: string) => {
    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) return;
    const generated = await generateAIExplanation(targetEvent, currentCase, selectedOrder || undefined, lang);
    setExplanations(prev => ({
      ...prev,
      [targetEvent.id]: generated
    }));
  };

  // Reset demo to initial state
  const handleResetDemo = () => {
    setIsResetting(true);
    setTimeout(() => {
      setCases(DEMO_CASES);
      setEvents(INITIAL_EVENTS);
      setOrders(INITIAL_ORDERS);
      setExplanations(PRECOMPUTED_EXPLANATIONS);
      setSelectedCaseId('case-cs-184-2024');
      setCitizenViewMode('overview');
      setIsResetting(false);
    }, 400);
  };

  return (
    <div className={`min-h-screen transition-colors ${
      accessibilitySettings.highContrast 
        ? 'dark bg-black text-white font-sans' 
        : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans'
    }`}>
      {/* Top Prototype Trust Notice Banner */}
      <TrustBanner />

      {/* Global App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={accessibilitySettings.language}
        setLanguage={(lang) => setAccessibilitySettings(prev => ({ ...prev, language: lang }))}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-8">
        {/* SURFACE 1: CITIZEN PORTAL */}
        {activeTab === 'citizen' && (
          <div className="space-y-8 animate-fadeIn">
            {citizenViewMode === 'overview' && (
              <>
                {/* Parallax Hero & CNR Search Bar */}
                <ParallaxHero
                  onSelectCase={handleSelectCase}
                  onSearch={handleSearch}
                  language={accessibilitySettings.language}
                />

                {/* Case Overview with 3 Citizen Answer Pillars */}
                <CaseOverviewCard
                  caseData={currentCase}
                  latestEvent={latestEvent}
                  explanation={currentExplanation}
                  onViewTimeline={() => setCitizenViewMode('timeline')}
                  onViewOrders={() => setCitizenViewMode('orders')}
                  ordersCount={caseOrders.length}
                  onExplainEvent={handleSelectEvent}
                  onSpeak={handleSpeak}
                  language={accessibilitySettings.language}
                />
              </>
            )}

            {citizenViewMode === 'timeline' && (
              <CaseTimelineView
                caseData={currentCase}
                events={caseEvents}
                explanations={explanations}
                onSelectEvent={handleSelectEvent}
                onBackToOverview={() => setCitizenViewMode('overview')}
                onSpeak={handleSpeak}
                language={accessibilitySettings.language}
              />
            )}

            {citizenViewMode === 'event-detail' && selectedEvent && (
              <EventExplanationDetail
                event={selectedEvent}
                caseData={currentCase}
                order={caseOrders.find(o => o.id === selectedEvent.relatedOrderId)}
                explanation={explanations[selectedEvent.id] ?? createFallbackExplanation(selectedEvent)}
                onBack={() => setCitizenViewMode('overview')}
                onViewOrder={handleSelectOrder}
                onSpeak={handleSpeak}
                isSpeaking={isSpeaking}
                onRegenerateExplanation={handleRegenerateExplanation}
                simplified={accessibilitySettings.simplifiedLanguage}
                onToggleSimplified={(value) => setAccessibilitySettings(prev => ({ ...prev, simplifiedLanguage: value }))}
                language={accessibilitySettings.language}
              />
            )}

            {citizenViewMode === 'orders' && (
              <OrdersDocumentViewer
                orders={caseOrders}
                caseData={currentCase}
                selectedOrder={selectedOrder || undefined}
                onSelectOrder={(ord) => setSelectedOrder(ord)}
                onBack={() => setCitizenViewMode('overview')}
                language={accessibilitySettings.language}
              />
            )}
          </div>
        )}

        {/* SURFACE 2: COURT OPERATIONS DEMO PORTAL */}
        {activeTab === 'staff' && (
          <CourtStaffPortal
            cases={cases}
            selectedCase={currentCase}
            onSelectCase={(c) => setSelectedCaseId(c.id)}
            onCreateCase={handleCreateCase}
            onPublishEvent={handlePublishEvent}
            onSwitchToCitizenView={() => {
              setActiveTab('citizen');
              setCitizenViewMode('overview');
            }}
          />
        )}
      </main>

      {/* Floating Quick Action Footer */}
      <footer className="mt-14 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">NyayaPath</span>
            <span>• Citizen-First Case Understanding Layer</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setIsAccessibilityOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Accessibility Options
            </button>
            <span className="text-slate-400">
              100% Synthetic Data • No Government Endorsement
            </span>
          </div>
        </div>
      </footer>

      {/* Accessibility Drawer / Modal */}
      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        settings={accessibilitySettings}
        onUpdateSettings={(newSettings) => setAccessibilitySettings(prev => ({ ...prev, ...newSettings }))}
      />

    </div>
  );
}
