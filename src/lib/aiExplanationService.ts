import { AIExplanation, Case, CaseEvent } from '../types';

export const AI_SYSTEM_INSTRUCTION = `You are NyayaPath AI, an objective citizen-side case understanding engine for Indian legal case events and orders.
You convert structured eCourts case updates into plain-language, non-technical explanations for ordinary citizens.

STRICT SAFETY CONSTRAINTS:
1. Use ONLY the provided structured case data and official event/order text.
2. NEVER infer unsupported facts.
3. NEVER fabricate dates, hearings, orders, parties, legal outcomes, procedural events, or judicial decisions.
4. NEVER predict a case outcome or assign likelihood of winning/losing.
5. NEVER provide legal advice.
6. If information is insufficient on any field, explicitly state: "The available case information does not specify this."
7. You MUST return ONLY a valid JSON object matching the requested schema.`;

export const AI_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string', description: 'One clear sentence summarizing the update in simple language.' },
    what_happened: { type: 'string', description: 'Plain-language explanation of what occurred during this hearing/event.' },
    what_it_means: { type: 'string', description: 'What this procedural step or order means for the case.' },
    what_happens_next: { type: 'string', description: 'The scheduled next step or subsequent hearing purpose.' },
    action_required: { type: 'string', description: 'Explicit citizen action required, or the standard not-specified statement.' },
    important_date: { type: 'string', description: 'Next hearing date or critical filing deadline extracted explicitly from the record.' },
    uncertainty_note: { type: 'string', description: 'Any missing or unstated details, or the standard not-specified statement.' },
    disclaimer: { type: 'string', description: 'Fixed disclaimer string: This is a plain-language explanation of the supplied case information, not legal advice.' }
  },
  required: ['summary', 'what_happened', 'what_it_means', 'what_happens_next', 'action_required', 'important_date', 'uncertainty_note', 'disclaimer']
};

const DISCLAIMER = 'This is a plain-language explanation of the supplied case information, not legal advice.';
const NOT_SPECIFIED = 'The available case information does not specify this.';
const ACTION_NOT_SPECIFIED = 'The available case information does not specify an action required from you.';

export function isValidExplanation(value: any): value is Omit<AIExplanation, 'id' | 'eventId'> {
  return value &&
    typeof value.summary === 'string' &&
    typeof value.what_happened === 'string' &&
    typeof value.what_it_means === 'string' &&
    typeof value.what_happens_next === 'string' &&
    typeof value.action_required === 'string' &&
    typeof value.important_date === 'string' &&
    typeof value.uncertainty_note === 'string' &&
    value.disclaimer === DISCLAIMER;
}

export function createUnavailableExplanation(event: CaseEvent, message = 'AI explanation unavailable right now. The supplied record is still available below.'): AIExplanation {
  return {
    id: `exp-unavailable-${event.id}-${Date.now()}`,
    eventId: event.id,
    summary: message,
    what_happened: message,
    what_it_means: NOT_SPECIFIED,
    what_happens_next: NOT_SPECIFIED,
    action_required: ACTION_NOT_SPECIFIED,
    important_date: event.nextHearingDate || 'None specified',
    uncertainty_note: message,
    disclaimer: DISCLAIMER,
    source: 'unavailable',
    error: message
  };
}

export function createFallbackExplanation(event: CaseEvent): AIExplanation {
  const date = event.nextHearingDate || 'None specified';
  const text = event.officialText.toLowerCase();

  let summary = 'A procedural update was recorded on your case.';
  let whatHappened = 'The court recorded a procedural step for this hearing.';
  let whatItMeans = 'The case is progressing according to the standard civil procedure timetable.';
  let whatNext = event.nextHearingDate ? `The matter is listed next on ${date}.` : NOT_SPECIFIED;
  let action = ACTION_NOT_SPECIFIED;

  if (text.includes('arguments heard') || text.includes('written submissions')) {
    summary = 'The court heard arguments today, but granted additional time for written submissions.';
    whatHappened = 'Arguments were presented before the judge. One of the parties requested time to submit written legal arguments.';
    whatItMeans = 'The case is approaching the final decision stage, but the judge will first examine written argument submissions.';
    whatNext = event.nextHearingDate ? `The case is listed for final arguments on ${date}.` : NOT_SPECIFIED;
  } else if (text.includes('evidence') || text.includes('cross-examination') || text.includes('pw-1')) {
    summary = 'Witness examination and documentary evidence were recorded.';
    whatHappened = 'Witnesses presented their statements and were questioned under cross-examination.';
    whatItMeans = 'The factual evidence phase is being conducted to verify party claims.';
    whatNext = event.nextHearingDate ? `Next hearing scheduled on ${date}.` : NOT_SPECIFIED;
  } else if (text.includes('issues framed')) {
    summary = 'The court framed the key points of dispute (issues) to be decided.';
    whatHappened = 'The judge reviewed the claims and identified the specific legal questions for trial.';
    whatItMeans = 'These framed issues determine what evidence both sides must prove.';
    whatNext = event.nextHearingDate ? `Listed on ${date} for presenting evidence.` : NOT_SPECIFIED;
  } else if (text.includes('summons') || text.includes('registration') || text.includes('registered')) {
    summary = 'The case has been formally registered in the court system and notices were issued.';
    whatHappened = 'The registry verified documents and officially assigned a case number.';
    whatItMeans = 'The legal proceeding is now formally active before the court bench.';
    whatNext = event.nextHearingDate ? `Next hearing date set for ${date}.` : NOT_SPECIFIED;
  } else if (text.includes('reserved for judgment')) {
    summary = 'The court recorded that rejoinder submissions were filed and the matter was reserved for judgment.';
    whatHappened = 'Rejoinder submissions were filed in the case.';
    whatItMeans = 'The record says the matter is reserved for judgment, but it does not specify a judgment date or outcome.';
    whatNext = NOT_SPECIFIED;
  }

  return {
    id: `exp-${event.id}-${Date.now()}`,
    eventId: event.id,
    summary,
    what_happened: whatHappened,
    what_it_means: whatItMeans,
    what_happens_next: whatNext,
    action_required: action,
    important_date: date,
    uncertainty_note: event.nextHearingDate ? NOT_SPECIFIED : 'The available case information does not specify a next hearing or judgment date.',
    confidence_note: `Grounded in ${event.eventType} entry dated ${event.eventDate}`,
    disclaimer: DISCLAIMER,
    source: 'fallback'
  };
}

export async function generateAIExplanation(
  event: CaseEvent,
  caseData?: Case,
  _order?: unknown,
  targetLanguage: string = 'en'
): Promise<AIExplanation> {
  if (!event.officialText.trim()) return createUnavailableExplanation(event, 'Official record text is missing, so AI explanation was not requested.');
  try {
    const response = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: event.id, caseId: event.caseId, event, caseData, language: targetLanguage })
    });
    if (!response.ok) throw new Error('AI route unavailable');
    return await response.json();
  } catch {
    return createUnavailableExplanation(event);
  }
}
