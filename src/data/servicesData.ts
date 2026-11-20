export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  deliverables: string[];
}

// Order matters: ServicesSection reads entries by index (0–3).
export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'custom-website-development',
    number: '01',
    title: 'Custom Website Development',
    description:
      'Custom-built, high-performance websites designed around your business. Fast load times, clean code and a responsive experience on every device.',
    deliverables: [
      'Bespoke design & development',
      'Fast, mobile-first performance',
      'Scalable, maintainable code',
      'Working preview in 15 minutes',
    ],
  },
  {
    id: 'ecommerce-development',
    number: '02',
    title: 'E-commerce Website Development',
    description:
      'Online stores built to convert, with smooth checkout, secure payment integrations and easy product management.',
    deliverables: ['Shopify & custom storefronts', 'Frictionless checkout', 'Stripe & PayPal integration'],
  },
  {
    id: 'website-redesign',
    number: '03',
    title: 'Website Design & Redesign',
    description:
      'Turn an outdated website into a modern digital experience, with careful content migration that protects your existing search rankings.',
    deliverables: ['Modern brand presentation', 'SEO-safe migration', 'Improved user experience'],
  },
  {
    id: 'seo-growth',
    number: '04',
    title: 'SEO Services',
    description:
      'On-page and technical SEO for US and UK markets — structured data, Core Web Vitals and local search optimisation to bring in the right visitors.',
    deliverables: ['Technical & on-page SEO', 'Core Web Vitals optimisation', 'US & UK local search'],
  },
];
