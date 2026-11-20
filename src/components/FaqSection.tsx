import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { AGENCY_CONFIG, getWhatsAppUrl } from '../config/agencyConfig';
import { trackEvent } from '../utils/privacyAnalytics';

interface FaqSectionProps {
  onOpenPreviewModal: () => void;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'free-preview',
    question: 'Is the 15-minute working website preview really free?',
    answer:
      'Yes. Once you submit your business details through our preview request form, our team prepares a custom working preview of your website within 15 minutes at no cost, with no upfront commitment and no obligation to proceed.',
  },
  {
    id: 'how-to-request-preview',
    question: 'How do I request and receive my 15-minute website preview?',
    answer:
      'Click "Get My Free Website Preview" and fill out our short enquiry form with your business name, website type, contact details, and goals. Our team reviews your requirements right away, builds a tailored working preview within 15 minutes, and shares it with you using the WhatsApp number or email you provided.',
  },
  {
    id: 'preview-contents',
    question: 'What will I actually see in the 15-minute preview?',
    answer:
      'You receive a live, working website preview built around your business—demonstrating the custom layout structure, modern UI/UX direction, responsive desktop and mobile experience, and core messaging before you commit to the complete project.',
  },
  {
    id: 'after-preview',
    question: 'What happens after I review the preview?',
    answer:
      'If you like the direction we created, we discuss your final page requirements, agree on the project scope and timeline, and proceed with developing your complete website. If you choose not to move forward, there is zero obligation.',
  },
  {
    id: 'services-offered',
    question: 'What website development and design services does Webtron Solution offer?',
    answer:
      'Webtron Solution specializes in Custom Website Development, E-commerce Website Development (online stores and product pages), Website Design & Redesign for outdated sites, and foundational SEO Services including on-page SEO, technical SEO, and search-friendly website structure.',
  },
  {
    id: 'service-inclusions',
    question: 'What is included in a custom website development project?',
    answer:
      'Every custom website project includes modern website design tailored to your audience, responsive engineering across mobile, tablet, and desktop, fast-loading code, SEO-friendly page structure, and conversion-ready enquiry forms or WhatsApp integration.',
  },
  {
    id: 'us-uk-support',
    question: 'Do you work with businesses in both the United States and the United Kingdom?',
    answer: `Yes. ${AGENCY_CONFIG.name} works with startup founders, small businesses, and growing companies across both the United States and the United Kingdom, with direct communication on WhatsApp (${AGENCY_CONFIG.name} support at +91 8910964232) throughout the project.`,
  },
];

export function FaqSection({ onOpenPreviewModal }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const handleToggle = (id: string) => {
    const nextOpen = openId !== id;
    setOpenId(nextOpen ? id : null);
    trackEvent('faq_toggle', { faqId: id, expanded: nextOpen });
  };

  return (
    <section id="faq" className="py-20 sm:py-28 border-t border-black/[0.08] bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column */}
          <div className="lg:col-span-4">
            <p className="text-xs font-bold font-display uppercase tracking-widest text-[#455CFF] mb-3">
              FAQ
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#171717] leading-tight">
              Frequently Asked Questions.
            </h2>
            <p className="mt-3 text-base text-[#6B7280] leading-relaxed">
              Clear answers about our 15-minute preview workflow and what goes into every build.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-start gap-3">
              <button
                type="button"
                onClick={onOpenPreviewModal}
                data-analytics-event="cta_preview_click"
                data-analytics-location="faq"
                className="inline-flex items-center justify-center rounded-full bg-[#455CFF] hover:bg-[#2E43E6] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-5px_rgba(69,92,255,0.3)] transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CFF] focus-visible:ring-offset-2"
              >
                Get My Free Website Preview
              </button>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="cta_whatsapp_click"
                data-analytics-location="faq"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-[#F8F8F5] hover:bg-[#F0F1F3] px-5 py-3.5 text-sm font-semibold text-[#171717] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CFF] focus-visible:ring-offset-2"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
                <span>Ask a Question on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-3.5">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              const panelId = `faq-panel-${item.id}`;
              const buttonId = `faq-button-${item.id}`;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-black/[0.08] bg-[#F8F8F5]/70 transition-colors duration-150 hover:border-[#455CFF]/30"
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => handleToggle(item.id)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CFF] focus-visible:ring-inset rounded-2xl"
                    >
                      <span className="font-display text-base sm:text-lg font-bold text-[#171717]">
                        {item.question}
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-5 w-5 shrink-0 text-[#6B7280] transition-transform duration-150 ${
                          isOpen ? 'rotate-180 text-[#455CFF]' : ''
                        }`}
                      />
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className="px-6 pb-5 pt-0"
                  >
                    <p className="text-sm sm:text-base leading-relaxed text-[#6B7280] border-t border-black/[0.06] pt-4">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
