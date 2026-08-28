import { AIExplanation, Case, CaseEvent, Order } from '../types';
import {
  AI_SYSTEM_INSTRUCTION,
  createUnavailableExplanation,
  isValidExplanation
} from './aiExplanationService';

export async function generateServerAIExplanation(
  event: CaseEvent,
  caseData?: Case,
  _order?: Order,
  targetLanguage: string = 'en'
): Promise<AIExplanation> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !event.officialText.trim()) return createUnavailableExplanation(event);

  try {
    const payload = {
      caseNumber: caseData?.caseNumber || 'Synthetic Case',
      court: caseData?.court || 'Demo District Court',
      eventType: event.eventType,
      eventDate: event.eventDate,
      officialText: event.officialText,
      nextHearingDate: event.nextHearingDate || 'Not specified'
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: AI_SYSTEM_INSTRUCTION },
          { role: 'user', content: `Explain this supplied synthetic case update in ${targetLanguage} as strict JSON:\n${JSON.stringify(payload)}` }
        ]
      })
    });

    if (!response.ok) return createUnavailableExplanation(event);
    const data = await response.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    if (!isValidExplanation(parsed)) {
      return createUnavailableExplanation(event, 'AI explanation returned invalid structured output. The supplied record is still available below.');
    }
    return { ...parsed, id: `exp-${event.id}-${Date.now()}`, eventId: event.id, language: targetLanguage, source: 'openai' };
  } catch {
    return createUnavailableExplanation(event);
  }
}
