import { FileText, MessageCircle } from 'lucide-react';
import { AGENCY_CONFIG, WHATSAPP_CONFIG, getWhatsAppUrl } from '../config/agencyConfig';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';

interface FooterProps {
  onOpenFormsWorkspace?: () => void;
}

export function Footer({ onOpenFormsWorkspace }: FooterProps) {
  return (
    <footer className="py-16 border-t border-black/[0.08] bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Col 1: Logo & Agency Summary */}
          <div className="md:col-span-5">
            <a
              href="#"
              aria-label={`${AGENCY_CONFIG.name} Home`}
              className="inline-flex items-center gap-2.5 mb-4 group"
            >
              <img
                src={AGENCY_CONFIG.logoUrl}
                alt={`${AGENCY_CONFIG.name} logo`}
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-10 w-10 rounded-lg object-contain bg-white border border-black/[0.06] shrink-0"
              />
              <span className="font-display font-extrabold text-xl tracking-tight text-[#171717]">
                WEBTRON <span className="text-[#455CFF]">SOLUTION</span>
              </span>
            </a>
            <p className="text-[#6B7280] text-sm leading-relaxed max-w-sm">
              We help businesses establish a stronger online presence through custom website
              development, professional website design and SEO services.
            </p>
          </div>

          {/* Col 2: Services */}
          <div className="md:col-span-3">
            <h4 className="font-display font-bold text-xs text-[#171717] uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm text-[#6B7280]">
              <li>
                <a href="#services" className="hover:text-[#455CFF] transition-colors">
                  Website Development
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#455CFF] transition-colors">
                  Website Design
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#455CFF] transition-colors">
                  E-commerce Development
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#455CFF] transition-colors">
                  Website Redesign
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#455CFF] transition-colors">
                  SEO Services
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Portfolio */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-xs text-[#171717] uppercase tracking-wider mb-4">
              Portfolio
            </h4>
            <ul className="space-y-2.5 text-sm text-[#6B7280]">
              {PORTFOLIO_PROJECTS.map((project) => (
                <li key={project.id}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics-event="portfolio_visit_click"
                    data-analytics-location="footer"
                    data-analytics-label={project.name}
                    className="hover:text-[#455CFF] transition-colors"
                  >
                    {project.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: WhatsApp Contact */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-xs text-[#171717] uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="space-y-2.5">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="cta_whatsapp_click"
                data-analytics-location="footer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#171717] hover:text-[#25D366] transition-colors whitespace-nowrap"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
                <span>WhatsApp: {WHATSAPP_CONFIG.displayNumber}</span>
              </a>
              <p className="text-xs text-[#6B7280]">
                United States &amp; United Kingdom
              </p>
              {onOpenFormsWorkspace && (
                <button
                  type="button"
                  onClick={onOpenFormsWorkspace}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#455CFF] hover:text-[#2E43E6] transition-colors cursor-pointer pt-1 whitespace-nowrap"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Google Forms &amp; Responses</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-black/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] gap-4">
          <p>
            &copy; {AGENCY_CONFIG.copyrightYear} {AGENCY_CONFIG.name}. All rights reserved.
          </p>
          <p>
            Helping businesses across the United States and United Kingdom build better digital
            experiences.
          </p>
        </div>
      </div>
    </footer>
  );
}
