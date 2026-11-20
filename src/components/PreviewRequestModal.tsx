import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Loader2,
  MessageCircle,
  X,
} from 'lucide-react';
import {
  GOOGLE_FORM_CONFIG,
  WHATSAPP_CONFIG,
  getGoogleFormEmbedUrl,
  getWhatsAppUrl,
  isGoogleFormConfigured,
} from '../config/agencyConfig';
import { trackPreviewModalConversion } from '../utils/conversionTracking';
import { trackEvent } from '../utils/privacyAnalytics';

interface PreviewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeGoogleFormUrl?: string;
}

const WEBSITE_TYPES = [
  'Business Website',
  'E-commerce Website',
  'Portfolio Website',
  'Landing Page',
  'Website Redesign',
  'Other',
] as const;

const COUNTRIES = ['USA', 'UK', 'Other'] as const;

interface FormValues {
  fullName: string;
  businessName: string;
  businessEmail: string;
  phone: string;
  country: (typeof COUNTRIES)[number];
  businessWebsite: string;
  websiteType: (typeof WEBSITE_TYPES)[number];
  requirements: string;
}

const INITIAL_VALUES: FormValues = {
  fullName: '',
  businessName: '',
  businessEmail: '',
  phone: '',
  country: 'USA',
  businessWebsite: '',
  websiteType: 'Business Website',
  requirements: '',
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

interface DispatchInfo {
  status: 'sent' | 'not_configured' | 'failed';
  provider: 'meta_cloud' | 'twilio' | 'webhook' | 'none';
  detail: string;
}

export function PreviewRequestModal({
  isOpen,
  onClose,
  activeGoogleFormUrl,
}: PreviewRequestModalProps) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [dispatchInfo, setDispatchInfo] = useState<DispatchInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [iframeLoadCount, setIframeLoadCount] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);
  const [shouldWarmIframe, setShouldWarmIframe] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const configuredFormUrl = (activeGoogleFormUrl || GOOGLE_FORM_CONFIG.formUrl).trim();
  const googleFormReady = isGoogleFormConfigured(configuredFormUrl);
  const embedUrl = getGoogleFormEmbedUrl(configuredFormUrl);
  const isEmbeddedGoogleForm = googleFormReady;
  const iframeLoaded = iframeLoadCount > 0;
  const formSubmittedInIframe = iframeLoadCount >= 2;

  useEffect(() => {
    setIframeLoadCount(0);
    setIframeKey((prev) => prev + 1);
  }, [embedUrl]);

  // Pre-warm the embedded Google Form iframe silently after page idle so modal open is instant.
  useEffect(() => {
    if (!isEmbeddedGoogleForm || shouldWarmIframe) return;
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof win.requestIdleCallback === 'function') {
      const id = win.requestIdleCallback(() => setShouldWarmIframe(true), { timeout: 1200 });
      return () => win.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(() => setShouldWarmIframe(true), 900);
    return () => window.clearTimeout(timer);
  }, [isEmbeddedGoogleForm, shouldWarmIframe]);

  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      trackPreviewModalConversion(
        isEmbeddedGoogleForm ? 'google_form' : 'built_in_form'
      );
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, isEmbeddedGoogleForm]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen && !(isEmbeddedGoogleForm && shouldWarmIframe)) return null;

  const validate = (data: FormValues): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!data.fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    if (!data.businessName.trim()) {
      nextErrors.businessName = 'Please enter your business name.';
    }
    if (!data.businessEmail.trim()) {
      nextErrors.businessEmail = 'Please enter your business email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.businessEmail.trim())) {
      nextErrors.businessEmail = 'Please enter a valid email address.';
    }
    if (!data.phone.trim()) {
      nextErrors.phone = 'Please enter your WhatsApp or phone number.';
    } else if (data.phone.replace(/\D/g, '').length < 7) {
      nextErrors.phone = 'Please enter a valid phone number.';
    }
    if (data.businessWebsite.trim()) {
      const candidate = data.businessWebsite.trim().startsWith('http')
        ? data.businessWebsite.trim()
        : `https://${data.businessWebsite.trim()}`;
      try {
        new URL(candidate);
      } catch {
        nextErrors.businessWebsite = 'Please enter a valid website URL (e.g. example.com).';
      }
    }
    if (!data.requirements.trim() || data.requirements.trim().length < 10) {
      nextErrors.requirements =
        'Please briefly describe your business and what you need from your website.';
    }
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(values);
    const errorCount = Object.keys(validationErrors).length;
    if (errorCount > 0) {
      setErrors(validationErrors);
      trackEvent('preview_form_validation_error', { errorCount });
      return;
    }

    setErrors({});
    setSubmitError(null);
    setDispatchInfo(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        whatsappDispatch?: DispatchInfo;
      } | null;

      if (!response.ok || !data?.ok) {
        const message =
          data?.error || 'Could not submit your request right now. Please try again.';
        setSubmitError(message);
        trackEvent('preview_form_submit_error', { status: response.status });
        return;
      }

      setDispatchInfo(data.whatsappDispatch ?? null);
      setSubmitted(true);
      trackEvent('preview_form_submitted', {
        websiteType: values.websiteType,
        country: values.country,
        hasExistingWebsite: Boolean(values.businessWebsite.trim()),
        whatsappDispatchStatus: data.whatsappDispatch?.status ?? 'unknown',
      });
    } catch {
      setSubmitError(
        'Network error while submitting your request. Please retry or message us directly on WhatsApp.'
      );
      trackEvent('preview_form_submit_error', { status: 'network_error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildBriefSummary = () => {
    const lines = [
      `Hi, I just requested a free 15-minute website preview:`,
      `Name: ${values.fullName.trim()}`,
      `Business: ${values.businessName.trim()} (${values.country})`,
      `Email: ${values.businessEmail.trim()}`,
      `Phone / WhatsApp: ${values.phone.trim()}`,
      `Website Type: ${values.websiteType}`,
      values.businessWebsite.trim() ? `Current Website: ${values.businessWebsite.trim()}` : null,
      `Requirements: ${values.requirements.trim()}`,
    ].filter(Boolean);
    return lines.join('\n');
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildBriefSummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setIsSubmitting(false);
    setSubmitError(null);
    setDispatchInfo(null);
    setErrors({});
    setCopied(false);
    if (formSubmittedInIframe) {
      setIframeLoadCount(0);
      setIframeKey((prev) => prev + 1);
    }
    onClose();
  };

  return (
    <div
      role={isOpen ? 'dialog' : undefined}
      aria-modal={isOpen ? 'true' : undefined}
      aria-hidden={!isOpen}
      aria-labelledby="preview-modal-title"
      className={
        isOpen
          ? `fixed inset-0 z-50 flex justify-center ${
              isEmbeddedGoogleForm ? 'items-end sm:items-center p-0 sm:p-6' : 'items-center p-4 sm:p-6'
            }`
          : 'fixed inset-0 -z-50 opacity-0 pointer-events-none invisible'
      }
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={handleResetAndClose}
        className="fixed inset-0 bg-[#171717]/65 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Surface */}
      <div
        className={`relative z-10 flex w-full flex-col overflow-hidden bg-white shadow-2xl ${
          isEmbeddedGoogleForm
            ? 'h-[100dvh] sm:h-[88vh] sm:max-h-[820px] sm:max-w-3xl rounded-none sm:rounded-2xl sm:border sm:border-slate-200'
            : 'max-h-[90vh] max-w-2xl rounded-2xl border border-slate-200'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-start justify-between gap-3 border-b border-slate-200 shrink-0 ${
            isEmbeddedGoogleForm ? 'px-4 py-3 sm:px-6 sm:py-4' : 'px-6 py-5'
          }`}
        >
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs font-semibold text-[#455CFF] uppercase tracking-wide">
              Free 15-Minute Website Preview
            </p>
            <h2
              id="preview-modal-title"
              className={`mt-0.5 font-display font-bold tracking-tight text-[#171717] ${
                isEmbeddedGoogleForm ? 'text-lg sm:text-xl' : 'mt-1 text-xl sm:text-2xl'
              }`}
            >
              Let&apos;s Build Your Website.
            </h2>
            <p
              className={`text-xs sm:text-sm text-[#6B7280] leading-relaxed ${
                isEmbeddedGoogleForm ? 'hidden sm:block mt-1' : 'mt-1.5'
              }`}
            >
              Tell us a little about your business and your website requirements. Our team will
              review your information and aim to share your custom working website preview within
              15 minutes.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleResetAndClose}
              aria-label="Close modal"
              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-[#171717] transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CFF]"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div
          className={
            isEmbeddedGoogleForm
              ? 'flex-1 min-h-0 flex flex-col overflow-hidden bg-[#F8F8F5]'
              : 'overflow-y-auto px-6 py-6'
          }
        >
          {/* Branch 1: Direct Responsive Google Form Iframe Embed */}
          {googleFormReady ? (
            <div className="relative flex-1 min-h-0 w-full bg-white">
              {!iframeLoaded && (
                <div
                  role="status"
                  aria-live="polite"
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#FAFAFA] p-6 text-center"
                >
                  <Loader2
                    className="h-7 w-7 animate-spin text-[#455CFF]"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    Loading preview request form...
                  </p>
                </div>
              )}
              <iframe
                key={iframeKey}
                src={embedUrl}
                title="Website Preview Request Form"
                onLoad={() => {
                  setIframeLoadCount((prev) => {
                    const next = prev + 1;
                    if (next === 2) {
                      trackEvent('google_form_submitted_in_iframe');
                    }
                    return next;
                  });
                }}
                className={`h-full w-full border-0 bg-white transition-opacity duration-200 ${
                  iframeLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          ) : submitted ? (
            /* Branch 2B: Submission Confirmation State (No fake backend / Google Form claim) */
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="py-4 text-center"
            >
              <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
                {!prefersReducedMotion && (
                  <motion.span
                    aria-hidden="true"
                    initial={{ scale: 0.85, opacity: 0.45 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full bg-emerald-400/35"
                  />
                )}
                <motion.div
                  initial={prefersReducedMotion ? false : { scale: 0.75, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                  className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200/80 text-[#059669]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="h-7 w-7"
                  >
                    <motion.path
                      d="M5.5 12.5L9.75 16.75L18.5 7.5"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={prefersReducedMotion ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  </svg>
                </motion.div>
              </div>

              <h3 className="mt-4 font-display text-xl font-bold text-[#171717]">
                Thank You! Your Request Has Been Received.
              </h3>

              <p className="mt-3 mx-auto max-w-lg text-sm sm:text-base leading-relaxed text-slate-600">
                Our team will review your requirements and aim to share your custom working website
                preview within 15 minutes. We will contact you using the details you provided.
              </p>

              {dispatchInfo?.status === 'sent' && (
                <div className="mt-4 mx-auto max-w-lg flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-left text-xs text-emerald-900">
                  <CheckCircle2
                    className="h-4 w-4 text-[#059669] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    Your brief has been automatically sent to our team on WhatsApp (
                    {WHATSAPP_CONFIG.displayNumber}) so we can start right away.
                  </span>
                </div>
              )}

              <div className="mt-6 rounded-xl border border-slate-200 bg-[#FAFAFA] p-4 text-left text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-[#171717] mb-1.5">Your Brief Summary</p>
                <p>
                  <span className="text-slate-400">Business:</span> {values.businessName} (
                  {values.country})
                </p>
                <p>
                  <span className="text-slate-400">Website Type:</span> {values.websiteType}
                </p>
                <p>
                  <span className="text-slate-400">Contact:</span> {values.businessEmail} ·{' '}
                  {values.phone}
                </p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <a
                  href={getWhatsAppUrl(buildBriefSummary())}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-event="cta_whatsapp_click"
                  data-analytics-location="preview_modal_success"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#059669] px-5 py-3 text-sm font-semibold text-white hover:bg-[#047857] transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Send Brief on WhatsApp Now</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  data-analytics-event="preview_brief_copied"
                  data-analytics-location="preview_modal_success"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#171717] hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  <span>{copied ? 'Copied Brief' : 'Copy Brief Summary'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setSubmitError(null);
                  setDispatchInfo(null);
                  setValues(INITIAL_VALUES);
                }}
                className="mt-5 text-xs font-medium text-slate-500 hover:text-[#171717] underline cursor-pointer"
              >
                Submit another request
              </button>
            </motion.div>
          ) : (
            /* Branch 2A: Complete 8-Field Website Preview Request Form */
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold text-[#171717] mb-1.5"
                  >
                    Full Name <span className="text-[#455CFF]">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={values.fullName}
                    onChange={(e) => setValues({ ...values, fullName: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    aria-invalid={Boolean(errors.fullName)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#171717] placeholder:text-slate-400 focus:border-[#455CFF] focus:outline-none focus:ring-2 focus:ring-[#455CFF]/20"
                  />
                  {errors.fullName && (
                    <p role="alert" className="mt-1 text-xs text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="businessName"
                    className="block text-xs font-semibold text-[#171717] mb-1.5"
                  >
                    Business Name <span className="text-[#455CFF]">*</span>
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required
                    value={values.businessName}
                    onChange={(e) => setValues({ ...values, businessName: e.target.value })}
                    placeholder="e.g. Oakridge Dental"
                    aria-invalid={Boolean(errors.businessName)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#171717] placeholder:text-slate-400 focus:border-[#455CFF] focus:outline-none focus:ring-2 focus:ring-[#455CFF]/20"
                  />
                  {errors.businessName && (
                    <p role="alert" className="mt-1 text-xs text-red-600">
                      {errors.businessName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="businessEmail"
                    className="block text-xs font-semibold text-[#171717] mb-1.5"
                  >
                    Business Email <span className="text-[#455CFF]">*</span>
                  </label>
                  <input
                    id="businessEmail"
                    name="businessEmail"
                    type="email"
                    required
                    value={values.businessEmail}
                    onChange={(e) => setValues({ ...values, businessEmail: e.target.value })}
                    placeholder="sarah@company.com"
                    aria-invalid={Boolean(errors.businessEmail)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#171717] placeholder:text-slate-400 focus:border-[#455CFF] focus:outline-none focus:ring-2 focus:ring-[#455CFF]/20"
                  />
                  {errors.businessEmail && (
                    <p role="alert" className="mt-1 text-xs text-red-600">
                      {errors.businessEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-semibold text-[#171717] mb-1.5"
                  >
                    WhatsApp / Phone Number <span className="text-[#455CFF]">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={values.phone}
                    onChange={(e) => setValues({ ...values, phone: e.target.value })}
                    placeholder="+1 (555) 234-5678"
                    aria-invalid={Boolean(errors.phone)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#171717] placeholder:text-slate-400 focus:border-[#455CFF] focus:outline-none focus:ring-2 focus:ring-[#455CFF]/20"
                  />
                  {errors.phone && (
                    <p role="alert" className="mt-1 text-xs text-red-600">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="country"
                    className="block text-xs font-semibold text-[#171717] mb-1.5"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={values.country}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        country: e.target.value as FormValues['country'],
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#171717] focus:border-[#455CFF] focus:outline-none focus:ring-2 focus:ring-[#455CFF]/20"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="businessWebsite"
                    className="block text-xs font-semibold text-[#171717] mb-1.5"
                  >
                    Business Website <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="businessWebsite"
                    name="businessWebsite"
                    type="url"
                    value={values.businessWebsite}
                    onChange={(e) => setValues({ ...values, businessWebsite: e.target.value })}
                    placeholder="https://yourbusiness.com"
                    aria-invalid={Boolean(errors.businessWebsite)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#171717] placeholder:text-slate-400 focus:border-[#455CFF] focus:outline-none focus:ring-2 focus:ring-[#455CFF]/20"
                  />
                  {errors.businessWebsite && (
                    <p role="alert" className="mt-1 text-xs text-red-600">
                      {errors.businessWebsite}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="websiteType"
                  className="block text-xs font-semibold text-[#171717] mb-1.5"
                >
                  Type of Website Required
                </label>
                <select
                  id="websiteType"
                  name="websiteType"
                  value={values.websiteType}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      websiteType: e.target.value as FormValues['websiteType'],
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#171717] focus:border-[#455CFF] focus:outline-none focus:ring-2 focus:ring-[#455CFF]/20"
                >
                  {WEBSITE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="requirements"
                  className="block text-xs font-semibold text-[#171717] mb-1.5"
                >
                  Briefly Describe Your Business and Requirements{' '}
                  <span className="text-[#455CFF]">*</span>
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  rows={3}
                  required
                  value={values.requirements}
                  onChange={(e) => setValues({ ...values, requirements: e.target.value })}
                  placeholder="Tell us what your business does, your target customers, and any pages or features you need..."
                  aria-invalid={Boolean(errors.requirements)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#171717] placeholder:text-slate-400 focus:border-[#455CFF] focus:outline-none focus:ring-2 focus:ring-[#455CFF]/20 resize-y"
                />
                {errors.requirements && (
                  <p role="alert" className="mt-1 text-xs text-red-600">
                    {errors.requirements}
                  </p>
                )}
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#455CFF] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#2E43E6] active:scale-[0.99] transition-all duration-150 cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CFF] focus-visible:ring-offset-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <span>Get My Free Website Preview</span>
                  )}
                </button>

                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-event="cta_whatsapp_click"
                  data-analytics-location="preview_modal_form"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="h-4 w-4 text-[#059669]" aria-hidden="true" />
                  <span>Prefer WhatsApp?</span>
                </a>
              </div>

              <p className="pt-1 text-center text-xs text-slate-500">
                Free Preview | No Upfront Commitment | No Obligation to Proceed
              </p>
            </form>
          )}

        </div>

        {isEmbeddedGoogleForm && (
          <div
            className={`shrink-0 border-t px-4 py-3 sm:px-6 sm:py-3.5 transition-colors ${
              formSubmittedInIframe
                ? 'border-emerald-200 bg-emerald-50/90'
                : 'border-slate-200 bg-[#FAFAFA]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
              {formSubmittedInIframe ? (
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-950">
                  <CheckCircle2
                    className="h-4 w-4 text-[#059669] shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    Form submitted! Tap to message us on WhatsApp and fast-track your 15-minute
                    preview.
                  </span>
                </div>
              ) : (
                <span className="text-xs text-[#6B7280] hidden sm:inline">
                  Want a faster response after submitting?
                </span>
              )}

              <div className="flex items-center justify-end gap-3">
                <a
                  href={getWhatsAppUrl(
                    formSubmittedInIframe
                      ? 'Hi, I just submitted the website preview form and would like to get started on my 15-minute preview!'
                      : undefined
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-event="cta_whatsapp_click"
                  data-analytics-location={
                    formSubmittedInIframe
                      ? 'preview_modal_google_form_submitted'
                      : 'preview_modal_google_form_footer'
                  }
                  className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#059669] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#047857] transition-colors whitespace-nowrap ${
                    formSubmittedInIframe ? 'w-full sm:w-auto shadow-sm' : ''
                  }`}
                >
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    {formSubmittedInIframe
                      ? 'Continue on WhatsApp Now'
                      : 'Chat on WhatsApp'}
                  </span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
