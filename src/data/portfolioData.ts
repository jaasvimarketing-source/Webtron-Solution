export interface PortfolioProject {
  id: string;
  name: string;
  category: string;
  location: string;
  url: string;
  displayDomain: string;
  summary: string;
  imageSrc: string;
  imageAlt: string;
  mockupTheme: {
    bg: string;
    ink: string;
    accent: string;
    heroHeadline: string;
    heroSubline: string;
    navItems: string[];
  };
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'zedesign-interiors',
    name: 'ZEDesign Interiors',
    category: 'Interior Design & Architecture',
    location: 'Preston, United Kingdom',
    url: 'https://zedesign.netlify.app',
    displayDomain: 'zedesign.netlify.app',
    summary:
      'An editorial portfolio and inquiry platform built for a UK luxury hospitality, restaurant, and residential interior design studio.',
    imageSrc: '/src/assets/images/portfolio_zedesign_interiors_1795155411728.jpg',
    imageAlt: 'ZEDesign Interiors bespoke luxury lounge project showcase',
    mockupTheme: {
      bg: '#F7F5F0',
      ink: '#18181B',
      accent: '#854D0E',
      heroHeadline: 'Interiors That Look Exceptional and Work Brilliantly.',
      heroSubline: 'Hospitality · Commercial · Luxury Residential',
      navItems: ['Projects', 'Studio', 'Services', 'Enquire'],
    },
  },
  {
    id: 'model-bridge-usa',
    name: 'Model Bridge USA',
    category: 'Modelling & Professional Services',
    location: 'New York, United States',
    url: 'https://modelbridgeusa.netlify.app',
    displayDomain: 'modelbridgeusa.netlify.app',
    summary:
      'A high-contrast editorial platform connecting emerging international talent with New York runway coaching and career development.',
    imageSrc: '/src/assets/images/portfolio_model_bridge_usa_1795155409765.jpg',
    imageAlt: 'Model Bridge USA New York studio runway training showcase',
    mockupTheme: {
      bg: '#FDFCFB',
      ink: '#111111',
      accent: '#111111',
      heroHeadline: 'From New York. Built for the World.',
      heroSubline: 'Runway Training · Bootcamps · Career Development',
      navItems: ['Programs', 'Mentors', 'NYC Intensive', 'Apply'],
    },
  },
  {
    id: 'timy-in-sicily',
    name: 'Timy in Sicily',
    category: 'Travel & Hospitality',
    location: 'Trapani & Erice, Sicily',
    url: 'https://timyinsicily.netlify.app',
    displayDomain: 'timyinsicily.netlify.app',
    summary:
      'A warm, hospitality-driven booking website showcasing private sea-view Sicilian cooking experiences and local wine tastings.',
    imageSrc: '/src/assets/images/portfolio_timy_in_sicily_1795155410710.jpg',
    imageAlt: 'Timy in Sicily Mediterranean terrace dining and cooking showcase',
    mockupTheme: {
      bg: '#F8F5EE',
      ink: '#242522',
      accent: '#B76545',
      heroHeadline: 'Authentic Sicily. Local Hospitality.',
      heroSubline: 'Private Sea-View Cooking Experience in Trapani & Erice',
      navItems: ['The Experience', 'Menu', 'Gallery', 'Book'],
    },
  },
  {
    id: 'onsite-electronics',
    name: 'On-Site Electronics',
    category: 'Electronics & IT Services',
    location: 'Massachusetts, United States',
    url: 'https://onsite-electronics.netlify.app',
    displayDomain: 'onsite-electronics.netlify.app',
    summary:
      'A trustworthy B2B and consumer service website presenting network installation, security audits, and 24/7 technical support.',
    imageSrc: '/src/assets/images/portfolio_onsite_electronics_1795155410778.jpg',
    imageAlt: 'On-Site Electronics IT engineering workstation and server infrastructure',
    mockupTheme: {
      bg: '#F8FAFC',
      ink: '#0F172A',
      accent: '#1D4ED8',
      heroHeadline: 'Computing Specialists Since 1985.',
      heroSubline: 'Business IT Infrastructure · Security · 24/7 Support',
      navItems: ['Business IT', 'Repairs', 'Security', 'Support'],
    },
  },
];
