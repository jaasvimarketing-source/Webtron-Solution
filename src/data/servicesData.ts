export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  featured: boolean;
  deliverables: string[];
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'custom-website-development',
    number: '01',
    title: 'Custom Website Development',
    description:
      'Your business deserves more than a generic website. We develop custom websites with modern designs, responsive layouts and user-friendly experiences. Whether you are launching a new business or expanding your online presence, we create websites tailored to your requirements.',
    featured: true,
    deliverables: [
      'Custom Website Development',
      'Responsive Design',
      'Modern UI/UX',
      'Business Websites',
    ],
  },
  {
    id: 'ecommerce-development',
    number: '02',
    title: 'E-commerce Website Development',
    description:
      'Take your business online with a professionally designed e-commerce website. Create a seamless shopping experience with attractive product pages, intuitive navigation and customer-friendly layouts.',
    featured: false,
    deliverables: ['Online Stores', 'Product Pages', 'E-commerce Solutions'],
  },
  {
    id: 'website-redesign',
    number: '03',
    title: 'Website Design & Redesign',
    description:
      'Is your existing website outdated? Give your business a fresh digital identity with modern website design, improved navigation and responsive layouts that create a better experience for your visitors.',
    featured: false,
    deliverables: ['Website Design', 'Website Redesign', 'Modern UI/UX'],
  },
  {
    id: 'seo-growth',
    number: '04',
    title: 'SEO Services',
    description:
      'A great website should also be easy to discover. We help businesses improve their website structure, on-page SEO, technical SEO and search visibility to attract relevant visitors through search engines.',
    featured: false,
    deliverables: ['On-Page SEO', 'Technical SEO', 'Website Optimisation'],
  },
];
