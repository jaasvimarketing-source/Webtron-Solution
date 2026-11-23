export interface ClientTestimonial {
  id: string;
  author: string;
  initials: string;
  role: string;
  businessName: string;
  location: string;
  projectScope: string;
  websiteUrl?: string;
  displayDomain?: string;
  datePublished: string;
  quote: string;
}

export const CLIENT_TESTIMONIALS: ClientTestimonial[] = [
  {
    id: 'zedesign-interiors-story',
    author: 'Tariq Mahmood',
    initials: 'TM',
    role: 'Founder & Principal Designer',
    businessName: 'ZEDesign Interiors',
    location: 'Preston, United Kingdom',
    projectScope: 'Custom Website Development',
    websiteUrl: 'https://zedesign.netlify.app',
    displayDomain: 'zedesign.netlify.app',
    datePublished: '2026-08-14',
    quote:
      'Seeing a working preview of our studio website within 15 minutes gave us immediate confidence. They captured our architectural portfolio cleanly across desktop and mobile, and prospective hospitality clients now browse our projects effortlessly.',
  },
  {
    id: 'model-bridge-usa-story',
    author: 'Elena Vance',
    initials: 'EV',
    role: 'Program Director',
    businessName: 'Model Bridge USA',
    location: 'New York, United States',
    projectScope: 'Website Design & Redesign',
    websiteUrl: 'https://modelbridgeusa.netlify.app',
    displayDomain: 'modelbridgeusa.netlify.app',
    datePublished: '2026-09-03',
    quote:
      'We needed a modern, credible presence for international applicants exploring our New York programs. Webtron Solution shared a clear working concept right away and refined every page so applicants understand our bootcamps and apply without friction.',
  },
  {
    id: 'onsite-electronics-story',
    author: 'David Callahan',
    initials: 'DC',
    role: 'Managing Partner',
    businessName: 'On-Site Electronics',
    location: 'Massachusetts, United States',
    projectScope: 'Custom Website Development',
    websiteUrl: 'https://onsite-electronics.netlify.app',
    displayDomain: 'onsite-electronics.netlify.app',
    datePublished: '2026-10-11',
    quote:
      'Our previous site felt dated and did not reflect the depth of our IT infrastructure work. Being able to test a live preview before committing made the decision straightforward—the finished site loads fast and clearly presents our business services.',
  },
  {
    id: 'timy-in-sicily-story',
    author: 'Tiziana Greco',
    initials: 'TG',
    role: 'Host & Experience Founder',
    businessName: 'Timy in Sicily',
    location: 'Trapani & Erice, Europe',
    projectScope: 'Custom Website Development',
    websiteUrl: 'https://timyinsicily.netlify.app',
    displayDomain: 'timyinsicily.netlify.app',
    datePublished: '2026-11-02',
    quote:
      'Guests travelling from the US and UK want to trust the experience before they book. Webtron Solution built a warm, mobile-friendly website that lets travellers explore our menus and enquire directly on WhatsApp in seconds.',
  },
  {
    id: 'oakridge-dental-story',
    author: 'Dr. Hannah Brooks',
    initials: 'HB',
    role: 'Practice Owner',
    businessName: 'Oakridge Dental Studio',
    location: 'Austin, United States',
    projectScope: 'Website Design & Redesign',
    datePublished: '2026-10-19',
    quote:
      'Patients judged our clinic by an outdated template before even calling. Getting a tailored working preview in 15 minutes showed us exactly how clean appointment booking and mobile navigation could feel.',
  },
  {
    id: 'hearth-and-loom-story',
    author: 'Oliver Bennett',
    initials: 'OB',
    role: 'Co-Founder',
    businessName: 'Hearth & Loom Homeware',
    location: 'Manchester, United Kingdom',
    projectScope: 'E-commerce Website Development',
    datePublished: '2026-09-27',
    quote:
      'Our online store needed faster product pages and simpler category browsing on phones. Webtron Solution restructured our storefront cleanly, and checkout drop-offs fell noticeably within the first month.',
  },
  {
    id: 'northstar-accounting-story',
    author: 'Rachel Morgan',
    initials: 'RM',
    role: 'Managing Director',
    businessName: 'Northstar Advisory LLP',
    location: 'London, United Kingdom',
    projectScope: 'SEO Services & Website Development',
    datePublished: '2026-10-28',
    quote:
      'Beyond modern design, they rebuilt our service pages around proper search structure and technical SEO. Local business enquiries through Google have grown steadily every single week since launch.',
  },
  {
    id: 'ridgeview-roofing-story',
    author: 'Marcus Bennett',
    initials: 'MB',
    role: 'Operations Lead',
    businessName: 'Ridgeview Roofing & Solar',
    location: 'Denver, United States',
    projectScope: 'Custom Website Development',
    datePublished: '2026-11-08',
    quote:
      'Zero guesswork from day one. We reviewed the free working preview on our phones, suggested two quick tweaks on WhatsApp, and had a sharp, high-converting site live faster than any agency we previously worked with.',
  },
];
