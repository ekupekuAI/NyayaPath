import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { DEMO_CASES, INITIAL_EVENTS, INITIAL_ORDERS, PRECOMPUTED_EXPLANATIONS } from './src/data/mockDatabase.ts';
import { generateServerAIExplanation } from './src/lib/serverOpenAIService.ts';
import { CaseEvent } from './src/types.ts';

// In-memory runtime state for live updates during the session
let cases = [...DEMO_CASES];
let events: CaseEvent[] = [...INITIAL_EVENTS];
let orders = [...INITIAL_ORDERS];
let explanations = { ...PRECOMPUTED_EXPLANATIONS };

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', product: 'NyayaPath', environment: 'production' });
  });

  // Get all cases or search by CNR/query
  app.get('/api/cases', (req: Request, res: Response) => {
    const q = ((req.query.q as string) || '').trim().toLowerCase();
    if (!q) {
      return res.json(cases);
    }
    const filtered = cases.filter(
      (c) =>
        c.cnr.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.petitioner.toLowerCase().includes(q) ||
        c.respondent.toLowerCase().includes(q) ||
        c.court.toLowerCase().includes(q)
    );
    res.json(filtered);
  });

  // Get single case with full timeline and orders
  app.get('/api/cases/:id', (req: Request, res: Response) => {
    const caseItem = cases.find((c) => c.id === req.params.id || c.cnr === req.params.id);
    if (!caseItem) {
      return res.status(404).json({ error: 'Synthetic case not found' });
    }
    const caseEvents = events
      .filter((e) => e.caseId === caseItem.id)
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    const caseOrders = orders.filter((o) => o.caseId === caseItem.id);

    res.json({
      case: caseItem,
      events: caseEvents,
      orders: caseOrders,
      explanations
    });
  });

  // Staff Portal: Add and publish a new synthetic case event
  app.post('/api/cases/:id/events', async (req: Request, res: Response) => {
    const caseId = req.params.id;
    const caseItem = cases.find((c) => c.id === caseId);
    if (!caseItem) {
      return res.status(404).json({ error: 'Synthetic case not found' });
    }

    const { eventType, eventDate, officialText, nextHearingDate, status = 'Published', createdBy = 'Demo Court Staff' } = req.body;

    if (!eventType || !eventDate || !officialText) {
      return res.status(400).json({ error: 'Missing required event fields' });
    }

    const newEvent: CaseEvent = {
      id: `evt-${caseItem.id.replace('case-', '')}-${Date.now().toString().slice(-4)}`,
      caseId,
      eventType,
      eventDate,
      officialText,
      nextHearingDate: nextHearingDate || undefined,
      status: status === 'Published' ? 'Published' : 'Draft',
      createdBy,
      publishedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };

    events.push(newEvent);

    // If next hearing date is provided, update case's next hearing
    if (nextHearingDate) {
      caseItem.nextHearingDate = nextHearingDate;
    }

    // Pre-generate AI explanation for the new event
    const generatedExplanation = await generateServerAIExplanation(newEvent, caseItem);
    explanations[newEvent.id] = generatedExplanation;

    res.status(201).json({
      event: newEvent,
      explanation: generatedExplanation,
      updatedCase: caseItem
    });
  });

  // Request fresh AI explanation for an event or order
  app.post('/api/explain', async (req: Request, res: Response) => {
    const { eventId, caseId, orderId, language = 'en', event: suppliedEvent, caseData: suppliedCase } = req.body;

    const event = events.find((e) => e.id === eventId) || suppliedEvent;
    const caseItem = cases.find((c) => c.id === (caseId || event?.caseId)) || suppliedCase;
    const order = orders.find((o) => o.id === orderId || o.id === event?.relatedOrderId);

    if ((!event || !event.officialText) && !order) {
      return res.status(400).json({ error: 'Event or Order reference required' });
    }

    const targetEvent: CaseEvent = event || {
      id: `order-evt-${order!.id}`,
      caseId: caseItem?.id || 'demo-case',
      eventType: 'Interlocutory Order',
      eventDate: order!.orderDate,
      officialText: order!.officialText,
      status: 'Published',
      createdBy: 'Order Scrutiny',
      publishedAt: order!.orderDate
    };

    const explanation = await generateServerAIExplanation(targetEvent, caseItem, order, language);
    explanations[targetEvent.id] = explanation;

    res.json(explanation);
  });

  // Reset database state back to initial seed (useful for live judge demos)
  app.post('/api/reset-demo', (req: Request, res: Response) => {
    cases = [...DEMO_CASES];
    events = [...INITIAL_EVENTS];
    orders = [...INITIAL_ORDERS];
    explanations = { ...PRECOMPUTED_EXPLANATIONS };
    res.json({ message: 'Demo database reset successfully.' });
  });

  // Vite middleware in dev; static assets in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NyayaPath server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
