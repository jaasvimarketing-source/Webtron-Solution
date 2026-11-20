import { ArrowRight, Globe, Laptop, MessageCircle, ShieldCheck, Zap } from 'lucide-react';
import { AGENCY_CONFIG, getWhatsAppUrl } from '../config/agencyConfig';
import { HeroMockup } from './HeroMockup';

interface HeroSectionProps {
  onOpenPreviewModal: () => void;
}

const TRUST_PILLARS = [
  {
    icon: Laptop,
    title: 'Modern Website Design',
    subtitle: 'Professional designs that make your business stand out.',
  },
  {
    icon: Zap,
    title: 'Responsive Website Development',
    subtitle: 'Websites that work seamlessly across mobile, tablet and desktop.',
  },
  {
    icon: Globe,
    title: 'SEO-Friendly Structure',
    subtitle: 'Built with search-friendly website structures and optimisation in mind.',
  },
  {
    icon: ShieldCheck,
    title: 'Designed Around Your Business',
    subtitle: 'Every website is created around your business, audience and goals.',
  },
] as const;

export function HeroSection({ onOpenPreviewModal }: HeroSectionProps) {
  return (
    <>
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 md:pt-40 md:pb-28 overflow-hidden">
        {/* Atmospheric Background Gradients */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#455CFF]/10 via-[#EAEBFF]/40 to-transparent rounded-full blur-3xl -z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-10 w-96 h-96 bg-[#EAEBFF]/60 rounded-full blur-3xl -z-10"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Clean Unboxed USP Eyebrow */}
          <p className="inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs font-bold font-display uppercase tracking-wider text-[#455CFF] mb-5">
            <span>FREE CUSTOM WEBSITE PREVIEW IN 15 MINUTES</span>
            <span aria-hidden="true" className="text-black/20">
              ·
            </span>
            <span className="text-[#6B7280] font-semibold">USA &amp; UK Focused</span>
          </p>

          {/* Main Headline & Supporting Paragraph */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-10">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold text-[#171717] leading-[1.08] tracking-tight mb-6">
              Professional Website Development for Businesses{' '}
              <span className="text-[#455CFF] underline decoration-[#455CFF]/25 underline-offset-8">
                Ready to Grow.
              </span>
            </h1>
            <div className="space-y-3 text-base sm:text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto font-normal leading-relaxed">
              <p>Looking for a professional website for your business?</p>
              <p>
                At <span className="font-semibold text-[#171717]">{AGENCY_CONFIG.name}</span>, we
                design and develop modern, responsive websites that help businesses build
                credibility, establish a strong online presence and attract more customers.
              </p>
              <p className="text-[#171717] font-medium">
                Tell us about your business and get a custom working website preview within 15
                minutes.
              </p>
            </div>
          </div>

          {/* Dual Conversion CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 mb-4">
            <button
              type="button"
              onClick={onOpenPreviewModal}
              data-analytics-event="cta_preview_click"
              data-analytics-location="hero"
              className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-4 rounded-full bg-[#455CFF] hover:bg-[#2E43E6] text-white font-semibold text-sm sm:text-base shadow-[0_10px_30px_-5px_rgba(69,92,255,0.35)] transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CFF] focus-visible:ring-offset-2"
            >
              <span>Get My Free Website Preview</span>
              <ArrowRight className="w-4.5 h-4.5" aria-hidden="true" />
            </button>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="cta_whatsapp_click"
              data-analytics-location="hero"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white hover:bg-[#F0F1F3] border border-black/[0.08] text-[#171717] font-semibold text-sm sm:text-base shadow-xs transition-all duration-150 hover:-translate-y-0.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CFF] focus-visible:ring-offset-2"
            >
              <MessageCircle className="w-4.5 h-4.5 text-[#25D366]" aria-hidden="true" />
              <span>Chat With Us on WhatsApp</span>
            </a>
          </div>

          <p className="text-xs sm:text-sm text-[#6B7280] mb-12 sm:mb-16">
            No upfront commitment. Experience our work before you decide.
          </p>

          {/* Interactive Browser + Mobile Showcase */}
          <div className="pb-2 sm:pb-10">
            <HeroMockup onOpenPreviewModal={onOpenPreviewModal} />
          </div>
        </div>
      </section>

      {/* Trust / Value Strip */}
      <section className="py-9 sm:py-10 border-y border-black/[0.08] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {TRUST_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="flex items-center gap-3.5 group">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#F0F1F3] border border-black/[0.06] flex items-center justify-center text-[#171717] group-hover:border-[#455CFF]/40 group-hover:text-[#455CFF] transition-colors duration-150">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xs sm:text-sm text-[#171717] leading-snug">
                      {pillar.title}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-[#6B7280] mt-0.5">
                      {pillar.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
