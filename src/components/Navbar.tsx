import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { AGENCY_CONFIG } from '../config/agencyConfig';

interface NavbarProps {
  onOpenPreviewModal: () => void;
}

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Our Work', href: '#portfolio' },
  { label: 'Client Stories', href: '#success-stories' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
] as const;

export function Navbar({ onOpenPreviewModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 sm:top-5 inset-x-0 z-40 flex flex-col items-center px-3 sm:px-6 pointer-events-none">
      <nav
        aria-label="Primary navigation"
        className="pointer-events-auto flex items-center justify-between gap-4 lg:gap-8 w-full max-w-6xl px-4 sm:px-6 py-2.5 bg-white/85 backdrop-blur-xl border border-black/[0.08] rounded-full shadow-[0_12px_32px_rgba(23,23,23,0.06)] transition-shadow duration-200 hover:shadow-[0_20px_40px_-15px_rgba(23,23,23,0.09)]"
      >
        {/* Zone 1: Single-line Brand Lockup */}
        <a
          href="#"
          aria-label={`${AGENCY_CONFIG.name} Home`}
          className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CFF] focus-visible:ring-offset-2 rounded-full"
        >
          <img
            src={AGENCY_CONFIG.logoUrl}
            alt={`${AGENCY_CONFIG.name} logo`}
            width={36}
            height={36}
            decoding="async"
            fetchPriority="high"
            referrerPolicy="no-referrer"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg object-contain bg-white border border-black/[0.06] shrink-0 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-[#171717]">
            WEBTRON <span className="text-[#455CFF]">SOLUTION</span>
          </span>
        </a>

        {/* Zone 2: Single-line Navigation Links */}
        <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#6B7280]">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-analytics-event="nav_link_click"
              data-analytics-location="navbar_desktop"
              data-analytics-label={link.label}
              className="whitespace-nowrap shrink-0 py-1 hover:text-[#171717] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CFF] focus-visible:ring-offset-2 rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Zone 3: Primary CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenPreviewModal}
            data-analytics-event="cta_preview_click"
            data-analytics-location="navbar_desktop"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-[#455CFF] hover:bg-[#2E43E6] text-white font-semibold text-xs sm:text-sm tracking-tight shadow-[0_10px_30px_-5px_rgba(69,92,255,0.35)] transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CFF] focus-visible:ring-offset-2"
          >
            <span>Get Free Preview</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex lg:hidden items-center justify-center rounded-full border border-black/[0.08] bg-white p-2 text-[#171717] hover:bg-[#F0F1F3] transition-colors cursor-pointer min-h-[40px] min-w-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CFF]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto mt-2 w-full max-w-6xl lg:hidden rounded-3xl border border-black/[0.08] bg-white/95 backdrop-blur-xl p-4 shadow-[0_20px_40px_-15px_rgba(23,23,23,0.12)]">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                data-analytics-event="nav_link_click"
                data-analytics-location="navbar_mobile"
                data-analytics-label={link.label}
                className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#171717] hover:bg-[#F0F1F3] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 mt-2 border-t border-black/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPreviewModal();
                }}
                data-analytics-event="cta_preview_click"
                data-analytics-location="navbar_mobile"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#455CFF] hover:bg-[#2E43E6] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-5px_rgba(69,92,255,0.35)] transition-colors cursor-pointer"
              >
                <span>Get My Free Website Preview</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
