import { useState } from 'react';
import { ExternalLink, Pause, Play, Quote } from 'lucide-react';
import { CLIENT_TESTIMONIALS, type ClientTestimonial } from '../data/testimonialsData';

function TestimonialCard({
  story,
  isDuplicate = false,
}: {
  story: ClientTestimonial;
  isDuplicate?: boolean;
}) {
  return (
    <figure className="w-[310px] sm:w-[390px] lg:w-[420px] shrink-0 rounded-3xl border border-black/[0.08] bg-[#F8F8F5] p-6 sm:p-8 flex flex-col justify-between transition-colors duration-200 hover:border-[#455CFF]/35">
      <div>
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs font-medium text-[#6B7280] leading-snug">
            <span>{story.projectScope}</span>
            <span aria-hidden="true" className="mx-1.5 text-black/20">
              ·
            </span>
            <span>{story.location}</span>
          </p>
          <Quote className="h-5 w-5 text-[#455CFF]/40 shrink-0" aria-hidden="true" />
        </div>

        <blockquote className="mt-4 text-sm sm:text-[15.5px] leading-relaxed text-[#171717]">
          &ldquo;{story.quote}&rdquo;
        </blockquote>
      </div>

      <figcaption className="mt-6 pt-4 border-t border-black/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            aria-hidden="true"
            className="h-9 w-9 rounded-full bg-[#EEF1FF] text-[#455CFF] font-display text-xs font-bold flex items-center justify-center shrink-0"
          >
            {story.initials}
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-[#171717] truncate">
              {story.author}
            </p>
            <p className="text-xs text-[#6B7280] truncate">
              {story.role},{' '}
              <span className="font-semibold text-[#171717]">{story.businessName}</span>
            </p>
          </div>
        </div>

        {story.websiteUrl && story.displayDomain && (
          <a
            href={story.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={isDuplicate ? -1 : undefined}
            aria-label={`Visit ${story.businessName} live website`}
            data-analytics-event="portfolio_visit_click"
            data-analytics-location="success_stories"
            data-analytics-label={story.businessName}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#455CFF] hover:text-[#2E43E6] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CFF] focus-visible:ring-offset-2 rounded-sm"
          >
            <span>{story.displayDomain}</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
      </figcaption>
    </figure>
  );
}

export function ClientSuccessStoriesSection() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section
      id="success-stories"
      aria-labelledby="success-stories-heading"
      className="py-16 sm:py-24 bg-white border-t border-black/[0.08] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold font-display uppercase tracking-widest text-[#455CFF] mb-3">
              Client Success Stories
            </p>
            <h2
              id="success-stories-heading"
              className="font-display text-3xl sm:text-5xl font-extrabold text-[#171717] leading-tight"
            >
              Trusted by Businesses Ready to Stand Out Online.
            </h2>
            <p className="text-[#6B7280] text-base sm:text-lg mt-3">
              Hear directly from the founders and teams behind our recent website design and
              development launches.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <p className="text-xs font-mono text-[#6B7280] whitespace-nowrap">
              {CLIENT_TESTIMONIALS.length} Client Stories
            </p>
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-pressed={isPaused}
              aria-label={isPaused ? 'Resume testimonial carousel' : 'Pause testimonial carousel'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-[#F8F8F5] px-3 py-1.5 text-xs font-semibold text-[#171717] hover:bg-[#F0F1F3] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CFF]"
            >
              {isPaused ? (
                <>
                  <Play className="h-3.5 w-3.5 text-[#455CFF]" aria-hidden="true" />
                  <span>Play</span>
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5 text-[#6B7280]" aria-hidden="true" />
                  <span>Pause</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Full-bleed infinite horizontal marquee container */}
      <div className="relative group">
        {/* Left & Right edge gradient fades */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-white to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-white to-transparent z-10"
        />

        <div className={isPaused ? 'overflow-x-auto px-4 sm:px-6' : 'overflow-hidden'}>
          <div
            className={`flex w-max ${
              isPaused
                ? ''
                : 'animate-[marquee-scroll_56s_linear_infinite] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]'
            }`}
          >
            {/* Primary track */}
            <div className="flex shrink-0 items-stretch gap-5 sm:gap-6 pr-5 sm:pr-6">
              {CLIENT_TESTIMONIALS.map((story) => (
                <TestimonialCard key={story.id} story={story} />
              ))}
            </div>

            {/* Duplicate track for seamless loop (hidden when paused for manual scrolling) */}
            {!isPaused && (
              <div
                aria-hidden="true"
                className="flex shrink-0 items-stretch gap-5 sm:gap-6 pr-5 sm:pr-6"
              >
                {CLIENT_TESTIMONIALS.map((story) => (
                  <TestimonialCard key={`${story.id}-dup`} story={story} isDuplicate />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
