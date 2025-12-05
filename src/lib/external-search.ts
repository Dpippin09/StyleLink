// External product search types and interfaces
export interface ExternalProduct {
  id: string
  title: string
  description?: string
  price: number
  originalPrice?: number
  currency: string
  imageUrl?: string
  productUrl: string
  platform: 'ebay' | 'walmart' | 'amazon' | 'google'
  brand?: string
  category?: string
  condition?: 'new' | 'used' | 'refurbished'
  shipping?: {
    cost: number
    free: boolean
  }
  seller?: {
    name: string
    rating?: number
  }
  rating?: number
  reviewCount?: number
}

export interface SearchResponse {
  success: boolean
  platform: string
  products: ExternalProduct[]
  totalResults?: number
  searchTime?: number
  error?: string
}

export interface MultiPlatformSearchResponse {
  success: boolean
  query: string
  totalProducts: number
  totalResults?: number
  products: ExternalProduct[]
  platformResults: Record<string, SearchResponse>
  searchOptions?: any
  searchTime: number
  averagePlatformTime?: number
  error?: string
}

// Platform configuration
export interface PlatformConfig {
  enabled: boolean
  apiKey?: string
  baseUrl: string
  rateLimitMs: number
}

export const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  ebay: {
    enabled: true,
    baseUrl: 'https://svcs.ebay.com/services/search/FindingService/v1',
    rateLimitMs: 1000,
  },
  walmart: {
    enabled: true,
    baseUrl: 'https://api.walmartlabs.com/v1/search',
    rateLimitMs: 1000,
  },
  // Amazon requires Product Advertising API approval
  amazon: {
    enabled: false,
    baseUrl: 'https://webservices.amazon.com/paapi5',
    rateLimitMs: 2000,
  },
  google: {
    enabled: false, // Requires Google Shopping API setup
    baseUrl: 'https://www.googleapis.com/customsearch/v1',
    rateLimitMs: 1000,
  }
}

// Clothing category mappings
export const CLOTHING_CATEGORIES = {
  ebay: {
    'dresses': '63861',
    'tops': '175724',
    'shoes': '95672',
    'jeans': '11483',
    'jackets': '57988',
    'accessories': '45'
  },
  walmart: {
    'dresses': '5438_1045799',
    'tops': '5438_1045804', 
    'shoes': '1115193',
    'jeans': '5438_133197',
    'jackets': '5438_1045802',
    'accessories': '3891'
  },
  amazon: {
    'dresses': 'Fashion',
    'tops': 'Fashion', 
    'shoes': 'Shoes',
    'jeans': 'Fashion',
    'jackets': 'Fashion',
    'accessories': 'Fashion'
  }
}
