
export enum Category {
  BRAND = 'Brand',
  TOOL = 'Tech & Tools',
  AGENCY = 'Agency'
}

export interface TechStack {
  name: string;
  category: string; // e.g., "Infrastructure", "Marketing", "Analytics"
  website?: string;
  directoryItem?: DirectoryItem; // For linking
}

export interface DirectoryItem {
  id: string;
  name: string;
  category: Category;
  description: string;
  logoUrl: string; // URL placeholder
  tags: string[];
  websiteUrl: string;
  
  // Specific to Brands
  techStack?: TechStack[];
  
  // Specific to Agencies
  services?: string[];
  partners?: string[]; // e.g., "Shopify Partner", "Google Partner"
  
  // Specific to Tools
  pricingModel?: string; // "Freemium", "Enterprise", etc.
}

export interface Submission {
  id: string;
  timestamp: number;
  status: 'pending' | 'approved' | 'rejected';
  data: DirectoryItem;
}

export interface FilterState {
  category: Category | 'All';
  searchQuery: string;
  selectedTag: string | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}
