import { useState } from 'react';
import { ArrowUpRight, Clock, Lock, Monitor, Smartphone } from 'lucide-react';

interface HeroMockupProps {
  onOpenPreviewModal: () => void;
}

const PREVIEW_PRESETS = {
  studio: {
    domain: 'webtron-preview.live/aura-studio',
    brand: 'Aura Studio',
    nav: ['Work', 'Services', 'Contact'],
    headline: 'Architectural Spaces Crafted for Modern Living.',
    subcopy: 'Bespoke residential & commercial interior architecture in London and New York.',
    cta: 'Book Consultation',
    image: '/src/assets/images/hero_agency_showcase_1795155410811.jpg',
    imageAlt: 'Modern architectural design studio desktop preview',
  },
  business: {
    domain: 'webtron-preview.live/harbor-build',
    brand: 'Harbor & Co.',
    nav: ['Services', 'Projects', 'Estimate'],
    headline: 'Custom Home & Commercial Remodeling Built to Last.',
    subcopy: 'Trusted craftspeople delivering transparent timelines and fixed-price builds.',
    cta: 'Request Estimate',
    image: '/src/assets/images/portfolio_zedesign_interiors_1795155411728.jpg',
    imageAlt: 'Luxury residential remodeling desktop preview',
  },
} as const;

export function HeroMockup({ onOpenPreviewModal }: HeroMockupProps) {
  const [activePreset, setActivePreset] = useState<'studio' | 'business'>('studio');
  const [imgError, setImgError] = useState(false);

  const preset = PREVIEW_PRESETS[activePreset];

  return (
    <div className="relative max-w-5xl mx-auto pt-4 sm:pt-6">
      {/* Ambient Back Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#455CFF]/15 to-transparent rounded-3xl blur-2xl -z-10"
      />

      {/* Floating Capability Card — Top Left */}
      <div className="absolute -top-2 left-2 sm:-left-6 z-30 hidden md:flex items-center gap-3 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-black/[0.08] shadow-[0_12px_32px_rgba(23,23,23,0.06)]">
        <div className="w-10 h-10 rounded-xl bg-[#EEF1FF] text-[#455CFF] flex items-center justify-center">
          <Monitor className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="text-left">
          <div className="text-xs font-bold text-[#171717]">Desktop &amp; Mobile</div>
          <div className="text-[11px] text-[#6B7280] font-medium">Responsive Live Preview</div>
        </div>
      </div>

      {/* Floating Prototype Mode Card — Top Right */}
      <div className="absolute top-1/4 -right-2 sm:-right-8 z-30 hidden md:flex items-center gap-3 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-black/[0.08] shadow-[0_12px_32px_rgba(23,23,23,0.06)]">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#EEF1FF] text-[#455CFF]">
          <Clock className="w-4.5 h-4.5" aria-hidden="true" />
        </div>
        <div className="text-left">
          <div className="text-xs font-bold text-[#171717]">Live Prototype Mode</div>
          <div className="text-[11px] text-[#455CFF] font-semibold">Ready in 15 mins</div>
        </div>
      </div>

      {/* Main Desktop Browser Shell */}
      <div className="relative bg-white rounded-2xl md:rounded-3xl border border-black/[0.08] shadow-[0_30px_70px_-15px_rgba(23,23,23,0.18)] overflow-hidden">
        {/* Browser Top Chrome Bar */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-[#F0F1F3] border-b border-black/[0.08]">
          {/* Mac Window Controls */}
          <div className="flex items-center gap-2 shrink-0" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
          </div>

          {/* Address Bar */}
          <div className="flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 bg-white rounded-full border border-black/[0.08] text-[11px] sm:text-xs text-[#6B7280] font-mono w-full max-w-[240px] sm:max-w-sm">
            <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
            <span className="truncate">{preset.domain}</span>
          </div>

          {/* Interactive Sample Switcher */}
          <div
            role="group"
            aria-label="Preview layout switcher"
            className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white border border-black/[0.08] p-0.5 shrink-0"
          >
            <button
              type="button"
              onClick={() => {
                setActivePreset('studio');
                setImgError(false);
              }}
              data-analytics-event="hero_mockup_switch"
              data-analytics-location="hero_mockup"
              data-analytics-label="UK Studio"
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activePreset === 'studio'
                  ? 'bg-[#171717] text-white'
                  : 'text-[#6B7280] hover:text-[#171717]'
              }`}
            >
              UK Studio
            </button>
            <button
              type="button"
              onClick={() => {
                setActivePreset('business');
                setImgError(false);
              }}
              data-analytics-event="hero_mockup_switch"
              data-analytics-location="hero_mockup"
              data-analytics-label="US Business"
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activePreset === 'business'
                  ? 'bg-[#171717] text-white'
                  : 'text-[#6B7280] hover:text-[#171717]'
              }`}
            >
              US Business
            </button>
          </div>
        </div>

        {/* Desktop Website Preview Viewport */}
        <div className="relative bg-white p-5 sm:p-8 md:p-10 text-left">
          {/* Simulated Client Site Navbar */}
          <div className="flex items-center justify-between pb-5 border-b border-black/[0.06]">
            <span className="font-display text-sm sm:text-base font-extrabold tracking-tight text-[#171717]">
              {preset.brand}
            </span>
            <div className="flex items-center gap-5 text-xs font-medium text-[#6B7280]">
              {preset.nav.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          {/* Simulated Client Hero */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#455CFF]">
                15-Minute Preview Concept
              </p>
              <h3 className="mt-2 font-display text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight text-[#171717]">
                {preset.headline}
              </h3>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#6B7280]">
                {preset.subcopy}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenPreviewModal}
                  data-analytics-event="cta_preview_click"
                  data-analytics-location="hero_mockup"
                  data-analytics-label={preset.brand}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] hover:bg-[#455CFF] px-4 py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  <span>{preset.cta}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-black/[0.08] bg-[#F0F1F3]">
                {!imgError ? (
                  <img
                    src={preset.image}
                    alt={preset.imageAlt}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#F0F1F3] to-[#EAEBFF] p-6 text-center">
                    <Monitor className="h-7 w-7 text-[#455CFF] mb-2" />
                    <span className="font-display text-sm font-bold text-[#171717]">
                      {preset.brand}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlapping Mobile Phone Mockup */}
      <div className="relative mt-5 sm:mt-0 sm:absolute sm:-bottom-8 sm:right-4 md:right-8 mx-auto w-56 sm:w-56 md:w-60 rounded-[32px] bg-[#171717] p-2.5 shadow-[0_25px_50px_-12px_rgba(23,23,23,0.28)] border-4 border-[#171717]/80 z-20 text-left">
        <div className="relative w-full bg-white rounded-[24px] overflow-hidden border border-black/10">
          {/* Phone Notch */}
          <div className="h-5 bg-[#171717] flex justify-center items-center">
            <div className="w-14 h-2 bg-white/20 rounded-full" />
          </div>

          <div className="p-3.5 bg-white">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-display text-[11px] font-extrabold text-[#171717]">
                {preset.brand}
              </span>
              <Smartphone className="h-3.5 w-3.5 text-[#6B7280]" aria-hidden="true" />
            </div>

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#F0F1F3] mb-2.5">
              {!imgError ? (
                <img
                  src={preset.image}
                  alt={`${preset.brand} mobile preview`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[#EAEBFF]" />
              )}
            </div>

            <p className="font-display text-xs font-extrabold leading-snug text-[#171717] line-clamp-2">
              {preset.headline}
            </p>
            <div className="mt-2.5 w-full rounded-full bg-[#455CFF] py-1.5 text-center text-[10px] font-semibold text-white">
              {preset.cta}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
