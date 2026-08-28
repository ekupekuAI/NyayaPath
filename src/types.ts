export type UserRole = 'citizen' | 'staff' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  email: string;
  name: string;
  designation?: string;
}

export type CaseStatus = 'Active' | 'Disposed' | 'Stayed' | 'Pending Final Arguments';

export interface Case {
  id: string;
  cnr: string;
  caseNumber: string;
  caseType: string;
  court: string;
  district: string;
  state: string;
  filingDate: string;
  status: CaseStatus;
  nextHearingDate: string;
  petitioner: string;
  petitionerAdvocate: string;
  respondent: string;
  respondentAdvocate: string;
  actSection: string;
  subject: string;
}

export type EventType = 
  | 'Case Filing'
  | 'Case Registration'
  | 'Notice Issued'
  | 'Written Statement Filed'
  | 'Issues Framed'
  | 'Evidence Hearing'
  | 'Oral Arguments'
  | 'Interlocutory Order'
  | 'Final Arguments Listed'
  | 'Judgment Reserved';

export interface CaseEvent {
  id: string;
  caseId: string;
  eventDate: string;
  eventType: EventType;
  officialText: string;
  status: 'Published' | 'Draft';
  createdBy: string;
  publishedAt: string;
  nextHearingDate?: string;
  courtBench?: string;
  relatedOrderId?: string;
}

export interface Order {
  id: string;
  caseId: string;
  orderDate: string;
  title: string;
  officialText: string;
  documentUrl?: string;
  judgeName: string;
  orderType: 'Interim Order' | 'Procedural Order' | 'Directions' | 'Notice' | 'Order Sheet';
  totalPages: number;
}

export interface AIExplanation {
  id: string;
  eventId: string;
  summary: string;
  what_happened: string;
  what_it_means: string;
  what_happens_next: string;
  action_required: string;
  important_date: string;
  uncertainty_note?: string;
  confidence_note?: string;
  disclaimer: string;
  language?: string;
  source?: 'openai' | 'fallback' | 'unavailable';
  error?: string;
}

export type LanguageCode = 'en' | 'hi' | 'te' | 'ta' | 'mr';

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  simplifiedLanguage: boolean;
  reducedMotion: boolean;
  language: LanguageCode;
}
