import { Check } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    label: 'Step 01',
    title: 'Tell Us About Your Business.',
    description:
      'Share your business details, industry, website requirements and design preferences through our short enquiry form.',
    footnote: 'Quick and simple enquiry.',
    highlighted: false,
  },
  {
    number: '02',
    label: 'Step 02',
    title: 'Get Your Working Website Preview.',
    description:
      'Our team reviews your requirements and creates a custom working website preview within 15 minutes, so you can experience our design and development capabilities.',
    footnote: 'A preview created around your business.',
    highlighted: true,
  },
  {
    number: '03',
    label: 'Step 03',
    title: 'Approve & Get Started.',
    description:
      'Like what you see? We will discuss the final requirements, agree on the project scope and proceed with developing your complete website.',
    footnote: 'Your approval. Your website.',
    highlighted: false,
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28 relative overflow-hidden bg-[#F8F8F5] border-t border-black/[0.08]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <p className="text-xs font-bold font-display uppercase tracking-widest text-[#455CFF] mb-3">
            Seamless Zero-Risk Process
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#171717] leading-tight mb-4">
            Your Website Preview in Just 15 Minutes.
          </h2>
          <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed mb-3">
            Getting a professional website should be simple. Tell us what you need, explore your
            custom preview and decide when you are ready to move forward.
          </p>
          <p className="text-[#455CFF] font-medium text-sm sm:text-base">
            See what we can create for your business before committing to the complete project.
          </p>
        </div>

        {/* Horizontal 3-Step Timeline with Connected Desktop Progress Line */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-7 sm:gap-8">
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#455CFF] via-[#455CFF]/40 to-[#455CFF] -z-0"
          />

          {STEPS.map((step) => (
            <div
              key={step.number}
              className={`relative z-10 bg-white rounded-3xl p-7 sm:p-8 flex flex-col group transition-all duration-200 ${
                step.highlighted
                  ? 'border-2 border-[#455CFF] shadow-[0_10px_30px_-5px_rgba(69,92,255,0.22)]'
                  : 'border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(23,23,23,0.08)]'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`w-13 h-13 rounded-2xl font-mono font-bold text-lg flex items-center justify-center transition-colors duration-200 tabular-nums ${
                    step.highlighted
                      ? 'bg-[#455CFF] text-white shadow-[0_10px_30px_-5px_rgba(69,92,255,0.35)]'
                      : 'bg-[#171717] text-white group-hover:bg-[#455CFF]'
                  }`}
                >
                  {step.number}
                </div>

                {step.highlighted && (
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#455CFF]">
                    15-Min Turnaround
                  </span>
                )}
              </div>

              <span className="text-xs font-mono uppercase tracking-wider text-[#455CFF] font-semibold mb-2">
                {step.label}
              </span>

              <h3 className="font-display text-xl font-extrabold text-[#171717] mb-3">
                {step.title}
              </h3>

              <p className="text-[#6B7280] text-sm leading-relaxed mb-6">{step.description}</p>

              <div className="mt-auto pt-4 border-t border-black/[0.06] flex items-center gap-2 text-xs text-[#171717] font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>{step.footnote}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
