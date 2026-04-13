export interface LocationParsed {
  city?: string;
  state?: string;
  country: string;
  region?: string;
}

export interface InventoryItem {
  code: string;
  title: string;
  category: string;
  categoryId: number;
  manufacturer: string;
  brand?: string;
  modelNumber?: string;
  serialNumber?: string;
  location: string;
  locationParsed: LocationParsed;
  price?: number;
  currency: string;
  condition?: string;
  quantity?: number;
  description: string;
  images: string[];
  imageFolder: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface InventoryData {
  items: InventoryItem[];
  categories: Category[];
  manufacturers: string[];
  locations: string[];
}

export interface FilterState {
  category?: string;
  manufacturer?: string;
  region?: string;
  country?: string;
  sellerIndustry?: string;
}

