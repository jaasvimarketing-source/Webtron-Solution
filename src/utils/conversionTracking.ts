import { trackEvent } from './privacyAnalytics';

export interface ConversionDetail {
  event: 'preview_modal_open';
  conversionTarget: 'preview_form_modal';
  buttonText: string;
  location: string;
  formMode: 'google_form' | 'built_in_form';
  path: string;
  timestamp: string;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    webtronTrackConversion?: (detail?: Partial<ConversionDetail>) => void;
  }
}

let listenerAttached = false;
let lastCtaTrigger: { buttonText: string; location: string; capturedAt: number } | null = null;

function isOptedOut(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return true;
  }
  const dnt =
    navigator.doNotTrack ||
    (window as unknown as { doNotTrack?: string }).doNotTrack ||
    (navigator as unknown as { msDoNotTrack?: string }).msDoNotTrack;
  return dnt === '1' || dnt === 'yes' || navigator.globalPrivacyControl === true;
}

function handleCtaCapture(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const button = target.closest<HTMLElement>(
    '[data-analytics-event="cta_preview_click"], button'
  );
  if (!button) return;

  const analyticsEvent = button.getAttribute('data-analytics-event');
  const text = (button.textContent || '').replace(/\s+/g, ' ').trim();

  if (
    analyticsEvent === 'cta_preview_click' ||
    text.toLowerCase().includes('get my free website preview')
  ) {
    lastCtaTrigger = {
      buttonText: text || 'Get My Free Website Preview',
      location: button.getAttribute('data-analytics-location') || 'landing_page',
      capturedAt: Date.now(),
    };
  }
}

function sendConversionBeacon(detail: ConversionDetail): void {
  if (typeof navigator === 'undefined') return;
  try {
    const payload = JSON.stringify({
      event: detail.event,
      location: detail.location,
      formMode: detail.formMode,
      buttonText: detail.buttonText,
      path: detail.path,
      timestamp: detail.timestamp,
    });
    if (typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/conversions', blob);
    } else if (typeof fetch === 'function') {
      void fetch('/api/conversions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => undefined);
    }
  } catch {
    // Ignore transport failures
  }
}

export function trackPreviewModalConversion(
  formMode: 'google_form' | 'built_in_form',
  overrideLocation?: string
): void {
  if (typeof window === 'undefined' || isOptedOut()) return;

  const recentTrigger =
    lastCtaTrigger && Date.now() - lastCtaTrigger.capturedAt < 3000
      ? lastCtaTrigger
      : null;

  const detail: ConversionDetail = {
    event: 'preview_modal_open',
    conversionTarget: 'preview_form_modal',
    buttonText: recentTrigger?.buttonText || 'Get My Free Website Preview',
    location: overrideLocation || recentTrigger?.location || 'landing_page',
    formMode,
    path: window.location.pathname || '/',
    timestamp: new Date().toISOString(),
  };

  trackEvent('preview_modal_open', {
    conversionTarget: detail.conversionTarget,
    location: detail.location,
    buttonText: detail.buttonText,
    formMode: detail.formMode,
  });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: detail.event,
    conversion_target: detail.conversionTarget,
    button_text: detail.buttonText,
    trigger_location: detail.location,
    form_mode: detail.formMode,
    page_path: detail.path,
  });

  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', 'preview_modal_open', {
        event_category: 'conversion',
        event_label: detail.location,
        button_text: detail.buttonText,
        form_mode: detail.formMode,
      });

      const adsConversionTo = (import.meta.env.VITE_GOOGLE_ADS_CONVERSION_TO || '').trim();
      if (adsConversionTo) {
        window.gtag('event', 'conversion', {
          send_to: adsConversionTo,
        });
      }
    } catch {
      // Ignore external tag errors
    }
  }

  sendConversionBeacon(detail);

  window.dispatchEvent(
    new CustomEvent<ConversionDetail>('webtron:conversion', { detail })
  );
}

export function initConversionTracking(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => undefined;
  }

  window.webtronTrackConversion = (custom) => {
    trackPreviewModalConversion(
      custom?.formMode || 'google_form',
      custom?.location
    );
  };

  if (!listenerAttached) {
    document.addEventListener('click', handleCtaCapture, { capture: true });
    listenerAttached = true;
  }

  return () => {
    if (listenerAttached) {
      document.removeEventListener('click', handleCtaCapture, { capture: true });
      listenerAttached = false;
    }
  };
}
