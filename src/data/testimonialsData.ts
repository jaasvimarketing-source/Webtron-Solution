export interface ClientTestimonial {
  id: string;
  quote: string;
  author: string;
  initials: string;
  role: string;
  businessName: string;
  projectScope: string;
  location: string;
  websiteUrl?: string;
  displayDomain?: string;
}

// Keep in sync with the Schema.org review data in index.html.
export const CLIENT_TESTIMONIALS: ClientTestimonial[] = [
  {
    id: 'zedesign-interiors',
    quote:
      'Seeing a working preview of our studio website within 15 minutes gave us immediate confidence. They captured our architectural portfolio cleanly across desktop and mobile, and prospective hospitality clients now browse our projects effortlessly.',
    author: 'Tariq Mahmood',
    initials: 'TM',
    role: 'Founder & Principal Designer',
    businessName: 'ZEDesign Interiors',
    projectScope: 'Custom Website Development',
    location: 'London, UK',
    websiteUrl: 'https://zedesign.netlify.app',
    displayDomain: 'zedesign.netlify.app',
  },
  {
    id: 'model-bridge-usa',
    quote:
      'We needed a modern, credible presence for international applicants exploring our New York programs. Webtron Solution shared a clear working concept right away and refined every page so applicants understand our bootcamps and apply without friction.',
    author: 'Elena Vance',
    initials: 'EV',
    role: 'Program Director',
    businessName: 'Model Bridge USA',
    projectScope: 'Website Design & Redesign',
    location: 'New York, USA',
    websiteUrl: 'https://modelbridgeusa.netlify.app',
    displayDomain: 'modelbridgeusa.netlify.app',
  },
  {
    id: 'onsite-electronics',
    quote:
      'Our previous site felt dated and did not reflect the depth of our IT infrastructure work. Being able to test a live preview before committing made the decision straightforward—the finished site loads fast and clearly presents our business services.',
    author: 'David Callahan',
    initials: 'DC',
    role: 'Managing Partner',
    businessName: 'On-Site Electronics',
    projectScope: 'Custom Website Development',
    location: 'USA',
    websiteUrl: 'https://onsite-electronics.netlify.app',
    displayDomain: 'onsite-electronics.netlify.app',
  },
  {
    id: 'timy-in-sicily',
    quote:
      'Guests travelling from the US and UK want to trust the experience before they book. Webtron Solution built a warm, mobile-friendly website that lets travellers explore our menus and enquire directly on WhatsApp in seconds.',
    author: 'Tiziana Greco',
    initials: 'TG',
    role: 'Host & Experience Founder',
    businessName: 'Timy in Sicily',
    projectScope: 'Custom Website Development',
    location: 'Sicily, Italy',
    websiteUrl: 'https://timyinsicily.netlify.app',
    displayDomain: 'timyinsicily.netlify.app',
  },
];
