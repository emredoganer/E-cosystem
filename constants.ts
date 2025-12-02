import { Category, DirectoryItem } from './types';

export const DIRECTORY_DATA: DirectoryItem[] = [
  // --- BRANDS ---
  {
    id: 'b1',
    name: 'Mavi',
    category: Category.BRAND,
    description: 'Turkey’s leading global fashion lifestyle brand, known for high quality denim.',
    logoUrl: 'https://picsum.photos/100/100?random=1',
    tags: ['Fashion', 'Apparel', 'Global'],
    websiteUrl: 'https://www.mavi.com',
    techStack: [
      { name: 'Akinon', category: 'Infrastructure' },
      { name: 'Insider', category: 'Growth' },
      { name: 'Iyzico', category: 'Payment' }
    ]
  },
  {
    id: 'b2',
    name: 'LC Waikiki',
    category: Category.BRAND,
    description: 'One of the world’s leading fashion retail brands with a philosophy that "Everyone deserves to dress well".',
    logoUrl: 'https://picsum.photos/100/100?random=2',
    tags: ['Fashion', 'Retail', 'Mass Market'],
    websiteUrl: 'https://www.lcwaikiki.com',
    techStack: [
      { name: 'Custom Built', category: 'Infrastructure' },
      { name: 'Segmentify', category: 'Personalization' },
      { name: 'Vispera', category: 'Visual AI' }
    ]
  },
  {
    id: 'b3',
    name: 'Getir',
    category: Category.BRAND,
    description: 'Pioneer of ultrafast grocery delivery, expanding globally from Turkey.',
    logoUrl: 'https://picsum.photos/100/100?random=3',
    tags: ['Q-Commerce', 'Delivery', 'Tech'],
    websiteUrl: 'https://getir.com',
    techStack: [
      { name: 'AWS', category: 'Cloud' },
      { name: 'Adjust', category: 'Attribution' },
      { name: 'Braze', category: 'CRM' }
    ]
  },
  {
    id: 'b4',
    name: 'Divarese',
    category: Category.BRAND,
    description: 'Iconic footwear and accessory brand blending Italian heritage with modern style.',
    logoUrl: 'https://picsum.photos/100/100?random=4',
    tags: ['Footwear', 'Luxury', 'Fashion'],
    websiteUrl: 'https://www.divarese.com.tr',
    techStack: [
      { name: 'Magento', category: 'Infrastructure' },
      { name: 'Emarsys', category: 'Marketing Automation' }
    ]
  },

  // --- TOOLS ---
  {
    id: 't1',
    name: 'Iyzico',
    category: Category.TOOL,
    description: 'Democratizing financial services with an easy-to-use payment platform for e-commerce.',
    logoUrl: 'https://picsum.photos/100/100?random=5',
    tags: ['Fintech', 'Payment Gateway', 'infrastructure'],
    websiteUrl: 'https://www.iyzico.com',
    pricingModel: 'Commission Based'
  },
  {
    id: 't2',
    name: 'Insider',
    category: Category.TOOL,
    description: 'A platform for individualized, cross-channel customer experiences.',
    logoUrl: 'https://picsum.photos/100/100?random=6',
    tags: ['MarTech', 'Personalization', 'AI'],
    websiteUrl: 'https://useinsider.com',
    pricingModel: 'Enterprise'
  },
  {
    id: 't3',
    name: 'Akinon',
    category: Category.TOOL,
    description: 'Headless digital commerce platform for enterprise brands.',
    logoUrl: 'https://picsum.photos/100/100?random=7',
    tags: ['Infrastructure', 'Headless', 'Cloud'],
    websiteUrl: 'https://akinon.com',
    pricingModel: 'Enterprise'
  },
  {
    id: 't4',
    name: 'Ticimax',
    category: Category.TOOL,
    description: 'Comprehensive e-commerce infrastructure provider popular among SMEs.',
    logoUrl: 'https://picsum.photos/100/100?random=8',
    tags: ['Infrastructure', 'SME', 'SaaS'],
    websiteUrl: 'https://www.ticimax.com',
    pricingModel: 'Subscription'
  },
  {
    id: 't5',
    name: 'Segmentify',
    category: Category.TOOL,
    description: 'eCommerce personalization platform to increase conversion rates.',
    logoUrl: 'https://picsum.photos/100/100?random=9',
    tags: ['Personalization', 'Analytics', 'CRO'],
    websiteUrl: 'https://www.segmentify.com',
    pricingModel: 'Performance Based'
  },

  // --- AGENCIES ---
  {
    id: 'a1',
    name: 'Positive',
    category: Category.AGENCY,
    description: 'Digital experience studio focusing on e-commerce strategy and design.',
    logoUrl: 'https://picsum.photos/100/100?random=10',
    tags: ['UX/UI', 'Development', 'Strategy'],
    websiteUrl: 'https://positive.com.tr',
    services: ['Custom Development', 'UX Design', 'Consultancy'],
    partners: ['Akinon Partner', 'Salesforce Partner']
  },
  {
    id: 'a2',
    name: 'Moo F Digital',
    category: Category.AGENCY,
    description: 'Full-service digital agency specializing in performance marketing and Shopify.',
    logoUrl: 'https://picsum.photos/100/100?random=11',
    tags: ['Marketing', 'Shopify', 'Performance'],
    websiteUrl: 'https://moof.com.tr',
    services: ['Growth Marketing', 'Shopify Development', 'SEO'],
    partners: ['Shopify Experts', 'Google Premier Partner']
  },
  {
    id: 'a3',
    name: 'Inveon',
    category: Category.AGENCY,
    description: 'Provides enterprise e-commerce platforms and growth management services.',
    logoUrl: 'https://picsum.photos/100/100?random=12',
    tags: ['Enterprise', 'Growth', 'Consultancy'],
    websiteUrl: 'https://inveon.com',
    services: ['Omnichannel Strategy', 'Digital Growth Management'],
    partners: ['Global Partnerships']
  }
];

export const TAGS = Array.from(new Set(DIRECTORY_DATA.flatMap(item => item.tags))).sort();
