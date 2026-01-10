// Real product fetcher for StyleLink homepage
// This file prioritizes live eBay data over empty mock data

import { searchEbay } from './ebay-search';
import { Product } from '@/hooks/useSearch';

interface FeaturedProductsConfig {
  queries: string[];
  maxPerQuery: number;
  totalLimit: number;
}

// Configuration for getting diverse, trending fashion products - CONSERVATIVE for rate limits
const FEATURED_CONFIG: FeaturedProductsConfig = {
  queries: [
    'trending fashion', // Single broad query instead of multiple specific ones
    'designer clothing'
  ],
  maxPerQuery: 4, // Get more per query since we're making fewer queries
  totalLimit: 8
};

// Convert eBay product to our internal Product format
function convertEbayToProduct(ebayProduct: any, index: number): Product {
  return {
    id: ebayProduct.id || `ebay_${index}_${Date.now()}`,
    title: ebayProduct.title || 'Fashion Item',
    brand: ebayProduct.brand || 'Designer',
    price: ebayProduct.price || 29.99,
    originalPrice: ebayProduct.originalPrice,
    rating: ebayProduct.rating || 4.2,
    reviews: ebayProduct.reviewCount || 156,
    image: ebayProduct.imageUrl || '/placeholder-image.jpg',
    retailer: 'eBay',
    category: ebayProduct.category || 'Fashion',
    inStock: true,
    description: ebayProduct.description,
    platform: 'ebay',
    productUrl: ebayProduct.productUrl
  };
}

// Cache for featured products to avoid hitting rate limits
let featuredProductsCache: {
  data: Product[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes cache

export async function getRealFeaturedProducts(limit: number = 8): Promise<{ success: boolean; data: Product[] }> {
  try {
    // Check cache first
    if (featuredProductsCache && Date.now() - featuredProductsCache.timestamp < CACHE_DURATION) {
      console.log('📦 Using cached featured products');
      return {
        success: true,
        data: featuredProductsCache.data.slice(0, limit)
      };
    }

    console.log('🔍 Fetching real featured products from eBay...');
    const allProducts: Product[] = [];
    
    // Fetch products from multiple fashion categories to ensure diversity
    for (const query of FEATURED_CONFIG.queries) {
      try {
        const result = await searchEbay(query, '', FEATURED_CONFIG.maxPerQuery);
        
        if (result.success && result.products.length > 0) {
          const convertedProducts = result.products.map((product, index) => 
            convertEbayToProduct(product, index)
          );
          allProducts.push(...convertedProducts);
          
          console.log(`✅ Got ${convertedProducts.length} products for "${query}"`);
          
          // Small delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          console.log(`⚠️ No products found for "${query}"`);
        }
      } catch (error) {
        console.error(`❌ Error fetching products for "${query}":`, error);
        // Continue with other queries even if one fails
      }
    }

    // Shuffle and limit results for variety
    const shuffledProducts = allProducts.sort(() => Math.random() - 0.5);
    const limitedProducts = shuffledProducts.slice(0, FEATURED_CONFIG.totalLimit);
    
    // Update cache
    featuredProductsCache = {
      data: limitedProducts,
      timestamp: Date.now()
    };

    console.log(`🎯 Successfully fetched ${limitedProducts.length} real featured products`);
    
    return {
      success: true,
      data: limitedProducts.slice(0, limit)
    };
    
  } catch (error) {
    console.error('❌ Error fetching real featured products:', error);
    
    // Return cached data if available, even if expired
    if (featuredProductsCache) {
      console.log('📦 Using expired cache due to API error');
      return {
        success: true,
        data: featuredProductsCache.data.slice(0, limit)
      };
    }
    
    // Last resort - return empty but don't show mock data
    return {
      success: false,
      data: []
    };
  }
}
