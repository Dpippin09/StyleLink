// Types for the mobile app
export interface Product {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  retailer: string;
  affiliateUrl: string;
  rating?: number;
  reviewCount?: number;
  sizes?: string[];
  colors?: string[];
}

export interface PriceAlert {
  id: string;
  productId: string;
  product: Product;
  targetPrice: number;
  isActive: boolean;
  createdAt: string;
}

export interface SearchFilters {
  priceMin?: number;
  priceMax?: number;
  brand?: string;
  size?: string;
  color?: string;
  retailer?: string;
}
