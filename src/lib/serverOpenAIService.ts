import { AIExplanation, Case, CaseEvent, Order } from '../types';
import {
  AI_RESPONSE_SCHEMA,
  AI_SYSTEM_INSTRUCTION,
  DISCLAIMER,
  createFallbackExplanation,
  isValidExplanation
} from './aiExplanationService';

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  te: 'Telugu',
  ta: 'Tamil',
  mr: 'Marathi'
};

export async function generateServerAIExplanation(
  event: CaseEvent,
  caseData?: Case,
  _order?: Order,
  targetLanguage: string = 'en'
): Promise<AIExplanation> {
  const apiKey = process.env.OPENAI_API_KEY;
  // Without a key, return the rule-based summary of the record instead of an empty "unavailable" card.
  if (!apiKey) return { ...createFallbackExplanation(event), error: 'OPENAI_API_KEY is not set on the server.' };

  try {
    const payload = {
      caseNumber: caseData?.caseNumber || 'Synthetic Case',
      court: caseData?.court || 'Demo District Court',
      eventType: event.eventType,
      eventDate: event.eventDate,
      officialText: event.officialText,
      nextHearingDate: event.nextHearingDate || 'Not specified'
    };
    const languageName = LANGUAGE_NAMES[targetLanguage] || 'English';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: AI_SYSTEM_INSTRUCTION },
          {
            role: 'user',
            content: `Explain this supplied synthetic case update in ${languageName}. Return a JSON object with exactly these keys: ${JSON.stringify(AI_RESPONSE_SCHEMA.properties)}\nCase update:\n${JSON.stringify(payload)}`
          }
        ]
      })
    });

    if (!response.ok) return { ...createFallbackExplanation(event), error: `AI request failed (HTTP ${response.status}).` };
    const data = await response.json();
    // The disclaimer is fixed text; set it here rather than trusting the model to echo it verbatim.
    const parsed = { ...JSON.parse(data.choices?.[0]?.message?.content || '{}'), disclaimer: DISCLAIMER };
    if (!isValidExplanation(parsed)) {
      return { ...createFallbackExplanation(event), error: 'AI returned invalid structured output.' };
    }
    return { ...parsed, id: `exp-${event.id}-${Date.now()}`, eventId: event.id, language: targetLanguage, source: 'openai' };
  } catch {
    return { ...createFallbackExplanation(event), error: 'AI request failed.' };
  }
}
