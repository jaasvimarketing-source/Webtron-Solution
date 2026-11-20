import { useState } from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { PORTFOLIO_PROJECTS, type PortfolioProject } from '../data/portfolioData';

function PortfolioCard({ project }: { project: PortfolioProject }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="bg-white rounded-3xl border border-black/[0.08] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(23,23,23,0.09)] transition-all duration-200 group flex flex-col justify-between">
      {/* Browser Header */}
      <div className="px-5 py-3.5 bg-[#F0F1F3] border-b border-black/[0.08] flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-black/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-black/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-black/15" />
        </div>
        <div className="text-[11px] font-mono text-[#6B7280] truncate max-w-[210px]">
          {project.displayDomain}
        </div>
        <span className="text-[11px] font-semibold text-[#455CFF] whitespace-nowrap shrink-0">
          {project.location.includes('United Kingdom')
            ? 'UK Studio'
            : project.location.includes('United States')
              ? 'US Build'
              : 'Europe'}
        </span>
      </div>

      {/* Preview Frame */}
      <div className="relative h-64 sm:h-72 overflow-hidden bg-[#F0F1F3]">
        {!imageFailed ? (
          <img
            src={project.imageSrc}
            alt={project.imageAlt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#F0F1F3] to-[#EAEBFF] p-6 text-center">
            <Globe className="h-7 w-7 text-[#455CFF] mb-2" />
            <span className="font-display text-sm font-bold text-[#171717]">{project.name}</span>
          </div>
        )}

        {/* Measured Scrim & Authentic Preview Caption */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="text-[11px] font-medium text-white/80">
            {project.mockupTheme.heroSubline}
          </p>
          <p className="mt-1 font-display text-base sm:text-lg font-bold leading-snug text-white">
            {project.mockupTheme.heroHeadline}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 sm:p-8 bg-white border-t border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#455CFF] uppercase tracking-wider truncate">
            {project.category}
          </p>
          <h3 className="font-display text-xl font-extrabold text-[#171717] mt-1">
            {project.name}
          </h3>
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="portfolio_visit_click"
          data-analytics-location="portfolio"
          data-analytics-label={project.name}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#F0F1F3] hover:bg-[#171717] hover:text-white text-[#171717] font-semibold text-xs tracking-tight transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CFF] focus-visible:ring-offset-2"
        >
          <span>View Live Website</span>
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export function PortfolioSection() {
  return (
    <section
      id="portfolio"
      className="py-20 sm:py-28 bg-[#F0F1F3]/60 border-t border-black/[0.08]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold font-display uppercase tracking-widest text-[#455CFF] mb-3">
              Verified Deployments
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#171717] leading-tight">
              Good Work Speaks for Itself.
            </h2>
            <p className="text-[#6B7280] text-base sm:text-lg mt-3">
              Explore some of our website design and development projects across different
              industries. We focus on creating modern, user-friendly digital experiences that
              reflect each business and its requirements.
            </p>
          </div>

          <p className="text-xs font-mono text-[#6B7280] whitespace-nowrap">
            4 Live Production Builds Featured
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8">
          {PORTFOLIO_PROJECTS.map((project) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
