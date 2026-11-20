import zedesignImage from '../assets/images/portfolio_zedesign_interiors_1795155411728.jpg';
import modelBridgeImage from '../assets/images/portfolio_model_bridge_usa_1795155409765.jpg';
import timyInSicilyImage from '../assets/images/portfolio_timy_in_sicily_1795155410710.jpg';
import onsiteElectronicsImage from '../assets/images/portfolio_onsite_electronics_1795155410778.jpg';

export interface PortfolioProject {
  id: string;
  name: string;
  category: string;
  location: string;
  url: string;
  displayDomain: string;
  imageSrc: string;
  imageAlt: string;
  mockupTheme: {
    heroHeadline: string;
    heroSubline: string;
  };
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'zedesign-interiors',
    name: 'ZEDesign Interiors',
    category: 'Architecture & Hospitality',
    location: 'London, United Kingdom',
    url: 'https://zedesign.netlify.app',
    displayDomain: 'zedesign.netlify.app',
    imageSrc: zedesignImage,
    imageAlt: 'ZEDesign Interiors website homepage preview',
    mockupTheme: {
      heroSubline: 'Interior Architecture Studio',
      heroHeadline: 'Spaces designed for hospitality and modern living.',
    },
  },
  {
    id: 'model-bridge-usa',
    name: 'Model Bridge USA',
    category: 'Modeling Academy & Editorial',
    location: 'New York, United States',
    url: 'https://modelbridgeusa.netlify.app',
    displayDomain: 'modelbridgeusa.netlify.app',
    imageSrc: modelBridgeImage,
    imageAlt: 'Model Bridge USA website homepage preview',
    mockupTheme: {
      heroSubline: 'New York Modeling Programs',
      heroHeadline: 'Your bridge to an international modeling career.',
    },
  },
  {
    id: 'timy-in-sicily',
    name: 'Timy in Sicily',
    category: 'Luxury Travel & Hospitality',
    location: 'Sicily, Italy',
    url: 'https://timyinsicily.netlify.app',
    displayDomain: 'timyinsicily.netlify.app',
    imageSrc: timyInSicilyImage,
    imageAlt: 'Timy in Sicily culinary experience website preview',
    mockupTheme: {
      heroSubline: 'Authentic Sicilian Culinary Experiences',
      heroHeadline: 'Cook, taste and celebrate Sicily with a local host.',
    },
  },
  {
    id: 'onsite-electronics',
    name: 'On-Site Electronics',
    category: 'Enterprise Tech & Systems',
    location: 'United States',
    url: 'https://onsite-electronics.netlify.app',
    displayDomain: 'onsite-electronics.netlify.app',
    imageSrc: onsiteElectronicsImage,
    imageAlt: 'On-Site Electronics IT support website preview',
    mockupTheme: {
      heroSubline: 'Commercial IT & Infrastructure',
      heroHeadline: 'Reliable on-site IT support for growing businesses.',
    },
  },
];
