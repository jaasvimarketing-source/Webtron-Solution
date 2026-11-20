import { ArrowRight, Code2, Globe, RefreshCw, ShoppingBag } from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';

interface ServicesSectionProps {
  onOpenPreviewModal: () => void;
}

const SERVICE_ICONS: Record<string, typeof Code2> = {
  'custom-website-development': Code2,
  'ecommerce-development': ShoppingBag,
  'website-redesign': RefreshCw,
  'seo-growth': Globe,
};

export function ServicesSection({ onOpenPreviewModal }: ServicesSectionProps) {
  const customDev = SERVICES_DATA[0];
  const ecommerce = SERVICES_DATA[1];
  const redesign = SERVICES_DATA[2];
  const seo = SERVICES_DATA[3];

  const EcomIcon = SERVICE_ICONS[ecommerce.id] ?? ShoppingBag;
  const RedesignIcon = SERVICE_ICONS[redesign.id] ?? RefreshCw;
  const SeoIcon = SERVICE_ICONS[seo.id] ?? Globe;

  return (
    <section className="py-20 sm:py-28 relative bg-[#F8F8F5]" id="services">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-xs font-bold font-display uppercase tracking-widest text-[#455CFF] mb-3">
            Disciplines &amp; Capabilities
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#171717] leading-tight">
            Website Development Solutions Built Around Your Business.
          </h2>
          <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed mt-4">
            From building your first business website to transforming an existing one, we help
            businesses create professional digital experiences through custom website development,
            modern design and SEO services.
          </p>
        </div>

        {/* Asymmetric Bento Grid: Website Development Featured Prominently */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* CARD 1: Custom Website Development (7 Cols) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-7 sm:p-10 border border-black/[0.08] shadow-[0_20px_40px_-15px_rgba(23,23,23,0.07)] relative overflow-hidden flex flex-col justify-between group hover:border-[#455CFF]/40 transition-all duration-200">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-[#455CFF]/5 rounded-full blur-2xl group-hover:bg-[#455CFF]/10 transition-colors"
            />
            <div>
              <div className="flex items-center justify-between mb-7">
                <div className="w-14 h-14 rounded-2xl bg-[#455CFF] text-white flex items-center justify-center shadow-[0_10px_30px_-5px_rgba(69,92,255,0.35)]">
                  <Code2 className="w-7 h-7" aria-hidden="true" />
                </div>
                <span className="text-xs font-bold text-[#455CFF] uppercase tracking-wider">
                  01 · Primary Focus
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#171717] mb-3.5">
                {customDev.title}
              </h3>
              <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed mb-7">
                {customDev.description}
              </p>

              <ul className="space-y-2 mb-8">
                {customDev.deliverables.map((item) => (
                  <li key={item} className="text-sm font-medium text-[#171717] flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#455CFF] shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-black/[0.08] flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Live Preview in 15m
              </span>
              <button
                type="button"
                onClick={onOpenPreviewModal}
                data-analytics-event="cta_preview_click"
                data-analytics-location="services"
                className="inline-flex items-center gap-2 text-[#455CFF] font-semibold text-sm group-hover:translate-x-1 transition-transform cursor-pointer whitespace-nowrap"
              >
                <span>Get Your Free Preview</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* CARD 2: E-commerce Website Development (5 Cols) */}
          <div className="md:col-span-5 bg-white rounded-3xl p-7 sm:p-10 border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between group hover:border-[#455CFF]/40 transition-all duration-200">
            <div>
              <div className="flex items-center justify-between mb-7">
                <div className="w-13 h-13 rounded-2xl bg-[#F0F1F3] border border-black/[0.06] text-[#171717] flex items-center justify-center group-hover:border-[#455CFF]/30 group-hover:text-[#455CFF] transition-colors">
                  <EcomIcon className="w-6 h-6" aria-hidden="true" />
                </div>
                <span className="font-mono text-xs text-[#6B7280] tabular-nums">{ecommerce.number}</span>
              </div>

              <h3 className="font-display text-2xl font-extrabold text-[#171717] mb-3">
                {ecommerce.title}
              </h3>
              <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed mb-6">
                {ecommerce.description}
              </p>

              <ul className="space-y-2 mb-6">
                {ecommerce.deliverables.map((item) => (
                  <li key={item} className="text-xs font-medium text-[#171717] flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#171717]/40 shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-black/[0.08] flex items-center justify-between text-xs font-medium text-[#6B7280]">
              <span>Online Stores</span>
              <span className="text-[#171717] font-semibold">E-commerce Solutions</span>
            </div>
          </div>

          {/* CARD 3: Website Design & Redesign (6 Cols) */}
          <div className="md:col-span-6 bg-white rounded-3xl p-7 sm:p-10 border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between group hover:border-[#455CFF]/40 transition-all duration-200">
            <div>
              <div className="flex items-center justify-between mb-7">
                <div className="w-13 h-13 rounded-2xl bg-[#F0F1F3] border border-black/[0.06] text-[#171717] flex items-center justify-center group-hover:border-[#455CFF]/30 group-hover:text-[#455CFF] transition-colors">
                  <RedesignIcon className="w-6 h-6" aria-hidden="true" />
                </div>
                <span className="font-mono text-xs text-[#6B7280] tabular-nums">{redesign.number}</span>
              </div>

              <h3 className="font-display text-2xl font-extrabold text-[#171717] mb-3">
                {redesign.title}
              </h3>
              <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed mb-6">
                {redesign.description}
              </p>

              <ul className="space-y-2 mb-6">
                {redesign.deliverables.map((item) => (
                  <li key={item} className="text-xs font-medium text-[#171717] flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#171717]/40 shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-black/[0.08] flex items-center justify-between text-xs font-medium text-[#6B7280]">
              <span>Website Design</span>
              <span className="text-[#171717] font-semibold">Modern UI/UX</span>
            </div>
          </div>

          {/* CARD 4: SEO Services (6 Cols) */}
          <div className="md:col-span-6 bg-white rounded-3xl p-7 sm:p-10 border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between group hover:border-[#455CFF]/40 transition-all duration-200">
            <div>
              <div className="flex items-center justify-between mb-7">
                <div className="w-13 h-13 rounded-2xl bg-[#F0F1F3] border border-black/[0.06] text-[#171717] flex items-center justify-center group-hover:border-[#455CFF]/30 group-hover:text-[#455CFF] transition-colors">
                  <SeoIcon className="w-6 h-6" aria-hidden="true" />
                </div>
                <span className="font-mono text-xs text-[#6B7280] tabular-nums">
                  {seo.number} · Secondary
                </span>
              </div>

              <h3 className="font-display text-2xl font-extrabold text-[#171717] mb-3">
                {seo.title}
              </h3>
              <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed mb-6">
                {seo.description}
              </p>

              <ul className="space-y-2 mb-6">
                {seo.deliverables.map((item) => (
                  <li key={item} className="text-xs font-medium text-[#171717] flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#171717]/40 shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-black/[0.08] flex items-center justify-between text-xs font-medium text-[#6B7280]">
              <span>On-Page &amp; Technical SEO</span>
              <span className="text-[#171717] font-semibold">Website Optimisation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
