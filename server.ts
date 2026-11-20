import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);
const DEFAULT_WHATSAPP_RECIPIENT = '918910964232';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'jaasvi.marketing@gmail.com').trim().toLowerCase();
const LEADS_FILE_PATH = path.resolve(__dirname, 'data', 'leads.json');
const CONVERSIONS_FILE_PATH = path.resolve(__dirname, 'data', 'conversions.json');

interface LeadPayload {
  fullName: string;
  businessName: string;
  businessEmail: string;
  phone: string;
  country: string;
  businessWebsite: string;
  websiteType: string;
  requirements: string;
}

type WhatsAppProvider = 'meta_cloud' | 'twilio' | 'webhook' | 'callmebot' | 'none';

interface DispatchResult {
  status: 'sent' | 'not_configured' | 'failed';
  provider: WhatsAppProvider;
  detail: string;
}

interface StoredLead extends LeadPayload {
  id: string;
  submittedAt: string;
  whatsappStatus?: DispatchResult['status'];
  whatsappProvider?: WhatsAppProvider;
}

function getActiveWhatsAppProvider(): WhatsAppProvider {
  if (
    process.env.WHATSAPP_CLOUD_ACCESS_TOKEN?.trim() &&
    process.env.WHATSAPP_PHONE_NUMBER_ID?.trim()
  ) {
    return 'meta_cloud';
  }
  if (
    process.env.TWILIO_ACCOUNT_SID?.trim() &&
    process.env.TWILIO_AUTH_TOKEN?.trim() &&
    process.env.TWILIO_WHATSAPP_FROM?.trim()
  ) {
    return 'twilio';
  }
  if (process.env.WHATSAPP_WEBHOOK_URL?.trim()) {
    return 'webhook';
  }
  if (process.env.WHATSAPP_CALLMEBOT_APIKEY?.trim()) {
    return 'callmebot';
  }
  return 'none';
}

function normalizeRecipientDigits(): string {
  const raw = process.env.WHATSAPP_RECIPIENT_NUMBER?.trim() || DEFAULT_WHATSAPP_RECIPIENT;
  const digits = raw.replace(/\D/g, '') || DEFAULT_WHATSAPP_RECIPIENT;
  return digits.length === 10 ? `91${digits}` : digits;
}

function formatWhatsAppMessage(lead: StoredLead): string {
  const lines = [
    '*New 15-Minute Website Preview Request*',
    `Lead ID: ${lead.id}`,
    `Name: ${lead.fullName}`,
    `Business: ${lead.businessName} (${lead.country})`,
    `Email: ${lead.businessEmail}`,
    `WhatsApp / Phone: ${lead.phone}`,
    `Website Type: ${lead.websiteType}`,
    lead.businessWebsite ? `Current Website: ${lead.businessWebsite}` : null,
    `Requirements: ${lead.requirements}`,
    `Submitted: ${lead.submittedAt}`,
  ].filter(Boolean);
  return lines.join('\n');
}

async function readStoredLeads(): Promise<StoredLead[]> {
  try {
    const raw = await fs.readFile(LEADS_FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredLead[]) : [];
  } catch {
    return [];
  }
}

async function persistLead(lead: StoredLead): Promise<void> {
  await fs.mkdir(path.dirname(LEADS_FILE_PATH), { recursive: true });
  const existing = await readStoredLeads();
  existing.unshift(lead);
  await fs.writeFile(LEADS_FILE_PATH, JSON.stringify(existing, null, 2), 'utf8');
}

interface ConversionStats {
  totalModalOpens: number;
  byLocation: Record<string, number>;
  byFormMode: Record<string, number>;
  lastConvertedAt: string | null;
}

async function recordConversionHit(location: string, formMode: string): Promise<void> {
  await fs.mkdir(path.dirname(CONVERSIONS_FILE_PATH), { recursive: true });
  let current: ConversionStats = {
    totalModalOpens: 0,
    byLocation: {},
    byFormMode: {},
    lastConvertedAt: null,
  };
  try {
    const raw = await fs.readFile(CONVERSIONS_FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<ConversionStats>;
    if (parsed && typeof parsed.totalModalOpens === 'number') {
      current = {
        totalModalOpens: parsed.totalModalOpens,
        byLocation: parsed.byLocation || {},
        byFormMode: parsed.byFormMode || {},
        lastConvertedAt: parsed.lastConvertedAt || null,
      };
    }
  } catch {
    // Initialize fresh aggregate counter
  }
  current.totalModalOpens += 1;
  current.byLocation[location] = (current.byLocation[location] || 0) + 1;
  current.byFormMode[formMode] = (current.byFormMode[formMode] || 0) + 1;
  current.lastConvertedAt = new Date().toISOString();
  await fs.writeFile(CONVERSIONS_FILE_PATH, JSON.stringify(current, null, 2), 'utf8');
}

async function dispatchWhatsAppNotification(lead: StoredLead): Promise<DispatchResult> {
  const provider = getActiveWhatsAppProvider();
  const recipientDigits = normalizeRecipientDigits();
  const formattedMessage = formatWhatsAppMessage(lead);

  if (provider === 'meta_cloud') {
    const token = process.env.WHATSAPP_CLOUD_ACCESS_TOKEN!.trim();
    const phoneNumberId = encodeURIComponent(process.env.WHATSAPP_PHONE_NUMBER_ID!.trim());
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME?.trim();

    const bodyPayload = templateName
      ? {
          messaging_product: 'whatsapp',
          to: recipientDigits,
          type: 'template',
          template: {
            name: templateName,
            language: { code: process.env.WHATSAPP_TEMPLATE_LANG?.trim() || 'en_US' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: lead.fullName },
                  { type: 'text', text: lead.businessName },
                  { type: 'text', text: lead.phone },
                  { type: 'text', text: lead.websiteType },
                  { type: 'text', text: lead.requirements.slice(0, 500) },
                ],
              },
            ],
          },
        }
      : {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientDigits,
          type: 'text',
          text: { preview_url: false, body: formattedMessage },
        };

    try {
      const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      });
      if (!res.ok) {
        const errText = await res.text();
        return {
          status: 'failed',
          provider,
          detail: `Meta WhatsApp Cloud API error (${res.status}): ${errText.slice(0, 180)}`,
        };
      }
      return {
        status: 'sent',
        provider,
        detail: `Automatically sent to WhatsApp +${recipientDigits} via Meta Cloud API.`,
      };
    } catch (error) {
      return {
        status: 'failed',
        provider,
        detail: error instanceof Error ? error.message : 'Meta Cloud API request failed.',
      };
    }
  }

  if (provider === 'twilio') {
    const sid = process.env.TWILIO_ACCOUNT_SID!.trim();
    const authToken = process.env.TWILIO_AUTH_TOKEN!.trim();
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM!.trim();
    const normalizedFrom = fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`;
    const normalizedTo = `whatsapp:+${recipientDigits}`;

    const formBody = new URLSearchParams({
      From: normalizedFrom,
      To: normalizedTo,
      Body: formattedMessage,
    });

    try {
      const credentials = Buffer.from(`${sid}:${authToken}`).toString('base64');
      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody.toString(),
        }
      );
      if (!res.ok) {
        const errText = await res.text();
        return {
          status: 'failed',
          provider,
          detail: `Twilio WhatsApp error (${res.status}): ${errText.slice(0, 180)}`,
        };
      }
      return {
        status: 'sent',
        provider,
        detail: `Automatically sent to WhatsApp +${recipientDigits} via Twilio.`,
      };
    } catch (error) {
      return {
        status: 'failed',
        provider,
        detail: error instanceof Error ? error.message : 'Twilio request failed.',
      };
    }
  }

  if (provider === 'webhook') {
    const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL!.trim();
    const webhookSecret = process.env.WHATSAPP_WEBHOOK_SECRET?.trim();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (webhookSecret) {
      headers.Authorization = `Bearer ${webhookSecret}`;
    }

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          event: 'website_preview_lead',
          targetWhatsAppNumber: `+${recipientDigits}`,
          formattedMessage,
          lead,
        }),
      });
      if (!res.ok) {
        return {
          status: 'failed',
          provider,
          detail: `Automation webhook returned HTTP ${res.status}.`,
        };
      }
      return {
        status: 'sent',
        provider,
        detail: `Automatically forwarded to WhatsApp automation webhook for +${recipientDigits}.`,
      };
    } catch (error) {
      return {
        status: 'failed',
        provider,
        detail: error instanceof Error ? error.message : 'Webhook dispatch failed.',
      };
    }
  }

  if (provider === 'callmebot') {
    const apiKey = process.env.WHATSAPP_CALLMEBOT_APIKEY!.trim();
    const url = new URL('https://api.callmebot.com/whatsapp.php');
    url.searchParams.set('phone', `+${recipientDigits}`);
    url.searchParams.set('text', formattedMessage);
    url.searchParams.set('apikey', apiKey);

    try {
      const res = await fetch(url.toString(), { method: 'GET' });
      if (!res.ok) {
        return {
          status: 'failed',
          provider,
          detail: `CallMeBot returned HTTP ${res.status}.`,
        };
      }
      return {
        status: 'sent',
        provider,
        detail: `Automatically sent to WhatsApp +${recipientDigits} via CallMeBot.`,
      };
    } catch (error) {
      return {
        status: 'failed',
        provider,
        detail: error instanceof Error ? error.message : 'CallMeBot request failed.',
      };
    }
  }

  return {
    status: 'not_configured',
    provider: 'none',
    detail:
      'Lead saved on server. Configure WHATSAPP_WEBHOOK_URL, WHATSAPP_CALLMEBOT_APIKEY, Meta WhatsApp Cloud API, or Twilio secrets to enable silent automated WhatsApp delivery.',
  };
}

function validateLeadBody(raw: unknown): { data?: LeadPayload; error?: string } {
  if (!raw || typeof raw !== 'object') {
    return { error: 'Invalid JSON request body.' };
  }
  const body = raw as Record<string, unknown>;
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const businessName = typeof body.businessName === 'string' ? body.businessName.trim() : '';
  const businessEmail = typeof body.businessEmail === 'string' ? body.businessEmail.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const country = typeof body.country === 'string' ? body.country.trim() : 'USA';
  const businessWebsite =
    typeof body.businessWebsite === 'string' ? body.businessWebsite.trim() : '';
  const websiteType =
    typeof body.websiteType === 'string' ? body.websiteType.trim() : 'Business Website';
  const requirements = typeof body.requirements === 'string' ? body.requirements.trim() : '';

  if (!fullName || !businessName || !businessEmail || !phone || requirements.length < 10) {
    return { error: 'Please complete all required fields before submitting.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) {
    return { error: 'Please provide a valid business email address.' };
  }

  return {
    data: {
      fullName,
      businessName,
      businessEmail,
      phone,
      country,
      businessWebsite,
      websiteType,
      requirements,
    },
  };
}

async function verifyAdminBearerToken(authHeader?: string): Promise<{ ok: boolean; email?: string; error?: string }> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { ok: false, error: 'Missing Google authorization token.' };
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    return { ok: false, error: 'Empty authorization token.' };
  }

  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      return { ok: false, error: 'Google session expired or invalid. Please sign in again.' };
    }
    const profile = (await res.json()) as { email?: string; email_verified?: boolean };
    const email = (profile.email || '').trim().toLowerCase();
    if (!email || !profile.email_verified) {
      return { ok: false, error: 'Verified Google email required.' };
    }
    if (email !== ADMIN_EMAIL) {
      return { ok: false, error: `Access restricted to agency owner (${ADMIN_EMAIL}).` };
    }
    return { ok: true, email };
  } catch {
    return { ok: false, error: 'Unable to verify Google authorization token.' };
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/leads/status', (_req: Request, res: Response) => {
    const provider = getActiveWhatsAppProvider();
    res.json({
      configured: provider !== 'none',
      provider,
      recipientNumber: `+${normalizeRecipientDigits()}`,
    });
  });

  app.get('/api/leads', async (req: Request, res: Response) => {
    const auth = await verifyAdminBearerToken(req.headers.authorization);
    if (!auth.ok) {
      res.status(401).json({ ok: false, error: auth.error });
      return;
    }

    const leads = await readStoredLeads();
    const provider = getActiveWhatsAppProvider();
    res.json({
      ok: true,
      leads,
      configured: provider !== 'none',
      provider,
      recipientNumber: `+${normalizeRecipientDigits()}`,
    });
  });

  app.post('/api/leads', async (req: Request, res: Response) => {
    const validated = validateLeadBody(req.body);
    if (!validated.data) {
      res.status(400).json({ ok: false, error: validated.error });
      return;
    }

    const baseLead: StoredLead = {
      ...validated.data,
      id: `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      submittedAt: new Date().toISOString(),
    };

    const whatsappDispatch = await dispatchWhatsAppNotification(baseLead);
    const storedLead: StoredLead = {
      ...baseLead,
      whatsappStatus: whatsappDispatch.status,
      whatsappProvider: whatsappDispatch.provider,
    };

    let saved = true;
    try {
      await persistLead(storedLead);
    } catch (error) {
      saved = false;
      console.error('Failed to persist lead on server:', error);
    }

    res.status(201).json({
      ok: true,
      leadId: storedLead.id,
      saved,
      whatsappDispatch,
    });
  });

  app.post('/api/conversions', async (req: Request, res: Response) => {
    const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<
      string,
      unknown
    >;
    const location =
      typeof body.location === 'string' && body.location.trim()
        ? body.location.trim().slice(0, 64)
        : 'landing_page';
    const formMode =
      typeof body.formMode === 'string' && body.formMode.trim()
        ? body.formMode.trim().slice(0, 32)
        : 'google_form';

    try {
      await recordConversionHit(location, formMode);
    } catch (error) {
      console.error('Failed to record conversion metric:', error);
    }

    res.status(204).end();
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(
      '/assets',
      express.static(path.join(distDir, 'assets'), {
        maxAge: '1y',
        immutable: true,
      })
    );
    app.use(express.static(distDir, { maxAge: '1h' }));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Webtron Solution server listening on http://0.0.0.0:${PORT}`);
  });
}

void startServer();
