/**
 * Lightweight, Cookie-Free, Privacy-First Analytics
 * -------------------------------------------------
 * - Zero cookies, zero localStorage/sessionStorage fingerprinting, zero PII.
 * - Honors browser Do Not Track (DNT) and Global Privacy Control (GPC).
 * - Supports optional Plausible, Umami, or custom Beacon endpoint via VITE_ env vars.
 * - Uses a single delegated click listener for [data-analytics-event] elements
 *   plus explicit trackEvent() calls for form submissions and interactive controls.
 */

export type AnalyticsPropValue = string | number | boolean;
export type AnalyticsProps = Record<string, AnalyticsPropValue>;

export interface PrivacyAnalyticsEventDetail {
  name: string;
  props: AnalyticsProps;
  path: string;
  timestamp: string;
}

declare global {
  interface Navigator {
    globalPrivacyControl?: boolean;
  }

  interface Window {
    plausible?: (eventName: string, options?: { props?: AnalyticsProps }) => void;
    umami?: {
      track: (eventName: string, data?: AnalyticsProps) => void;
    };
  }
}

let initialized = false;
let scriptInjected = false;

function isTrackingOptedOut(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return true;
  }

  const dnt =
    navigator.doNotTrack ||
    (window as unknown as { doNotTrack?: string }).doNotTrack ||
    (navigator as unknown as { msDoNotTrack?: string }).msDoNotTrack;

  if (dnt === '1' || dnt === 'yes') {
    return true;
  }

  if (navigator.globalPrivacyControl === true) {
    return true;
  }

  return false;
}

function getAnalyticsConfig() {
  const env = import.meta.env;
  return {
    provider: (env.VITE_ANALYTICS_PROVIDER || '').trim().toLowerCase(),
    scriptUrl: (env.VITE_ANALYTICS_SCRIPT_URL || '').trim(),
    domain: (env.VITE_ANALYTICS_DOMAIN || '').trim(),
    websiteId: (env.VITE_ANALYTICS_WEBSITE_ID || '').trim(),
    endpoint: (env.VITE_ANALYTICS_ENDPOINT || '').trim(),
  };
}

function injectExternalPrivacyScript(): void {
  if (scriptInjected || typeof document === 'undefined' || isTrackingOptedOut()) {
    return;
  }

  const { provider, scriptUrl, domain, websiteId } = getAnalyticsConfig();
  if (!scriptUrl) return;

  try {
    const parsedUrl = new URL(scriptUrl);
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      return;
    }
  } catch {
    return;
  }

  const existing = document.querySelector<HTMLScriptElement>(
    'script[data-webtron-privacy-analytics="true"]'
  );
  if (existing) {
    scriptInjected = true;
    return;
  }

  const script = document.createElement('script');
  script.defer = true;
  script.src = scriptUrl;
  script.setAttribute('data-webtron-privacy-analytics', 'true');

  if (provider === 'plausible' && domain) {
    script.setAttribute('data-domain', domain);
  } else if (provider === 'umami' && websiteId) {
    script.setAttribute('data-website-id', websiteId);
  } else {
    if (domain) script.setAttribute('data-domain', domain);
    if (websiteId) script.setAttribute('data-website-id', websiteId);
  }

  document.head.appendChild(script);
  scriptInjected = true;
}

function sendBeaconPayload(detail: PrivacyAnalyticsEventDetail): void {
  const { endpoint } = getAnalyticsConfig();
  if (!endpoint || typeof navigator === 'undefined') return;

  try {
    const payload = JSON.stringify(detail);
    if (typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else if (typeof fetch === 'function') {
      void fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => undefined);
    }
  } catch {
    // Fail silently so analytics never interrupts user interactions
  }
}

export function trackEvent(name: string, props: AnalyticsProps = {}): void {
  if (typeof window === 'undefined' || isTrackingOptedOut()) {
    return;
  }

  const sanitizedName = name.trim();
  if (!sanitizedName) return;

  const detail: PrivacyAnalyticsEventDetail = {
    name: sanitizedName,
    props,
    path: window.location.pathname || '/',
    timestamp: new Date().toISOString(),
  };

  if (typeof window.plausible === 'function') {
    try {
      window.plausible(sanitizedName, { props });
    } catch {
      // Ignore third-party adapter failures
    }
  }

  if (window.umami && typeof window.umami.track === 'function') {
    try {
      window.umami.track(sanitizedName, props);
    } catch {
      // Ignore third-party adapter failures
    }
  }

  sendBeaconPayload(detail);

  window.dispatchEvent(
    new CustomEvent<PrivacyAnalyticsEventDetail>('webtron:analytics', {
      detail,
    })
  );
}

function handleDocumentClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const trackedElement = target.closest<HTMLElement>('[data-analytics-event]');
  if (!trackedElement) return;

  const eventName = trackedElement.getAttribute('data-analytics-event');
  if (!eventName) return;

  const props: AnalyticsProps = {};
  const location = trackedElement.getAttribute('data-analytics-location');
  const label = trackedElement.getAttribute('data-analytics-label');

  if (location) props.location = location;
  if (label) props.label = label;

  trackEvent(eventName, props);
}

export function initPrivacyAnalytics(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => undefined;
  }

  if (isTrackingOptedOut()) {
    return () => undefined;
  }

  injectExternalPrivacyScript();

  if (!initialized) {
    document.addEventListener('click', handleDocumentClick, { capture: true });
    initialized = true;

    let referrerHost = '';
    if (document.referrer) {
      try {
        referrerHost = new URL(document.referrer).hostname;
      } catch {
        referrerHost = '';
      }
    }

    trackEvent('pageview', {
      ...(referrerHost ? { referrerHost } : {}),
    });
  }

  return () => {
    if (initialized) {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      initialized = false;
    }
  };
}
