import { ArrowRight, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../config/agencyConfig';

interface FinalCtaSectionProps {
  onOpenPreviewModal: () => void;
}

export function FinalCtaSection({ onOpenPreviewModal }: FinalCtaSectionProps) {
  return (
    <section id="contact" className="py-20 sm:py-28 relative bg-[#F8F8F5] border-t border-black/[0.08]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl md:rounded-[40px] bg-[#171717] text-white p-8 sm:p-16 md:p-20 overflow-hidden shadow-2xl">
          {/* Atmospheric Gradient Glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-[#455CFF]/40 rounded-full blur-[100px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/25 rounded-full blur-[100px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10"
          />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <p className="text-xs font-mono uppercase tracking-wider text-[#EAEBFF] mb-5">
              YOUR WEBSITE COULD BE JUST 15 MINUTES AWAY.
            </p>

            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5 leading-tight text-white">
              Ready to Give Your Business a Better Website?
            </h2>

            <p className="text-base sm:text-xl text-gray-300 leading-relaxed mb-9 max-w-xl mx-auto">
              Tell us about your business. We will create a custom working website preview so you
              can experience what your next website could look like.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
              <button
                type="button"
                onClick={onOpenPreviewModal}
                data-analytics-event="cta_preview_click"
                data-analytics-location="final_cta"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#455CFF] hover:bg-[#2E43E6] text-white font-semibold text-sm sm:text-base shadow-[0_10px_30px_-5px_rgba(69,92,255,0.4)] transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]"
              >
                <span>Get My Free Website Preview</span>
                <ArrowRight className="w-4.5 h-4.5" aria-hidden="true" />
              </button>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="cta_whatsapp_click"
                data-analytics-location="final_cta"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-md transition-all duration-150 hover:scale-[1.02] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]"
              >
                <MessageCircle className="w-4.5 h-4.5 text-[#25D366]" aria-hidden="true" />
                <span>Talk to Us on WhatsApp</span>
              </a>
            </div>

            <p className="mt-8 text-xs text-gray-400 font-mono">
              Free preview. No upfront commitment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
