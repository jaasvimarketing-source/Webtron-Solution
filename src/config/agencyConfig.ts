/**
 * Central Agency & Lead Integration Configuration
 * ------------------------------------------------
 * Update AGENCY_CONFIG.name with your official agency name when ready.
 * Paste your published Google Form URL into GOOGLE_FORM_CONFIG.formUrl
 * to switch the Preview Request modal to live Google Forms capture.
 */

export const AGENCY_CONFIG = {
  name: 'Webtron Solution',
  logoUrl: '/assets/aistudio/webtron_Solution_Logo_cc07d9a0.jpeg',
  markets: 'United States & United Kingdom',
  copyrightYear: 2026,
} as const;

export const WHATSAPP_CONFIG = {
  displayNumber: '+91 8910964232',
  baseUrl: 'https://wa.me/918910964232',
  defaultMessage:
    'Hi, I came across your website and would like to discuss getting a website developed for my business.',
} as const;

export function getWhatsAppUrl(customMessage?: string): string {
  const message = customMessage ?? WHATSAPP_CONFIG.defaultMessage;
  return `${WHATSAPP_CONFIG.baseUrl}?text=${encodeURIComponent(message)}`;
}

export interface GoogleFormConfig {
  /**
   * Paste your published Google Form URL here when ready, e.g.:
   * 'https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform'
   * Leave empty ('') until a real Google Form URL is configured and tested.
   */
  formUrl: string;
  /**
   * 'modal' embeds the Google Form inside the preview request modal (with a
   * fallback button to open in a new tab).
   * 'new_tab' opens the configured Google Form directly in a new browser tab.
   */
  preferredDelivery: 'modal' | 'new_tab';
}

export const GOOGLE_FORM_CONFIG: GoogleFormConfig = {
  formUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLScg4ZwU06kfhDC5tR2cFonn59Jp7z0dP2AcWaDqUJeX5bqFBg/viewform',
  preferredDelivery: 'modal',
};

export function isGoogleFormConfigured(overrideUrl?: string): boolean {
  const trimmed = (overrideUrl ?? GOOGLE_FORM_CONFIG.formUrl).trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function getGoogleFormEmbedUrl(overrideUrl?: string): string {
  const trimmed = (overrideUrl ?? GOOGLE_FORM_CONFIG.formUrl).trim();
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed);
    parsed.searchParams.delete('usp');
    if (!parsed.searchParams.has('embedded')) {
      parsed.searchParams.set('embedded', 'true');
    }
    return parsed.toString();
  } catch {
    return trimmed;
  }
}
