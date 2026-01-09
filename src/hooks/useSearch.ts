'use client';

import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  retailer: string;
  category: string;
  inStock: boolean;
  description?: string;
  sizes?: string[];
  colors?: string[];
  platform?: string;
  productUrl?: string;
}

// Helper function to convert external products to internal format
function convertExternalToProduct(externalProduct: any): Product {
  return {
    id: externalProduct.id,
    title: externalProduct.title,
    brand: externalProduct.brand || 'Unknown',
    price: externalProduct.price,
    originalPrice: externalProduct.originalPrice,
    rating: externalProduct.rating || 4.0,
    reviews: externalProduct.reviewCount || 0,
    image: externalProduct.imageUrl || '/placeholder-image.jpg',
    retailer: externalProduct.platform || 'External',
    category: externalProduct.category || 'General',
    inStock: true,
    description: externalProduct.description,
    platform: externalProduct.platform,
    productUrl: externalProduct.productUrl
  };
}

export function useSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [cachedResults, setCachedResults] = useState<{ [key: string]: { data: Product[], timestamp: number } }>({});
  
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache to reduce API calls

  const searchProducts = async (query: string): Promise<Product[]> => {
    setIsLoading(true);
    
    try {
      // Check cache first with timestamp
      const cacheKey = `search_${query.toLowerCase()}`;
      const cached = cachedResults[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('Using cached results for:', query);
        setIsLoading(false);
        return cached.data;
      }

      // For now, focus on external search since database is empty
      // When you have products in the database, you can re-enable the parallel search
      
      // External search API (eBay, etc.) - reduced max results to avoid rate limits
      const response = await fetch(`/api/search/external?q=${encodeURIComponent(query)}&maxResults=10&platforms=ebay`);
      const data = await response.json();
      
      console.log('Search API response:', data); // Debug log
      console.log('Response structure:', {
        success: data.success,
        hasPlatformResults: !!data.platformResults,
        platformResultsKeys: data.platformResults ? Object.keys(data.platformResults) : 'none',
        ebayData: data.platformResults?.ebay || 'none'
      });
      
      if (data.success && data.platformResults && data.platformResults.ebay) {
        console.log('eBay platform data:', data.platformResults.ebay);
        console.log('eBay products:', data.platformResults.ebay.products);
        
        if (data.platformResults.ebay.products && data.platformResults.ebay.products.length > 0) {
          const webResults = data.platformResults.ebay.products.map((product: any) => convertExternalToProduct(product));
          const combinedResults = webResults;
    
          // Simple deduplication based on title similarity
          const uniqueResults = combinedResults.filter((product: Product, index: number, self: Product[]) => {
            return index === self.findIndex((p: Product) => 
              p.title.toLowerCase().trim() === product.title.toLowerCase().trim()
            );
          });

          // Sort by relevance (database results first, then external by rating)
          const sortedResults = uniqueResults.sort((a: Product, b: Product) => {
            // Prioritize database results
            if (a.platform && !b.platform) return 1;
            if (!a.platform && b.platform) return -1;
            
            // Then by rating * reviews
            return (b.rating * Math.log(b.reviews + 1)) - (a.rating * Math.log(a.reviews + 1));
          });

          // Cache results with timestamp
          setCachedResults(prev => ({
            ...prev,
            [cacheKey]: {
              data: sortedResults,
              timestamp: Date.now()
            }
          }));

          setIsLoading(false);
          return sortedResults;
        } else {
          console.log('🚫 eBay returned successful response but 0 products found for query:', query);
          console.log('This might be due to rate limiting or no matching products');
        }
      } else {
        console.log('🚫 eBay platform data not found or unsuccessful response');
        if (data.platformResults?.ebay?.error) {
          console.log('eBay error details:', data.platformResults.ebay.error);
        }
      }
      
      setIsLoading(false);
      return [];
      
    } catch (error) {
      console.error('Search error:', error);
      setIsLoading(false);
      return [];
    }
  };

  const getProductsByCategory = async (category: string): Promise<Product[]> => {
    setIsLoading(true);
    
    try {
      // Check cache first with timestamp
      const cacheKey = `category_${category.toLowerCase()}`;
      const cached = cachedResults[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setIsLoading(false);
        return cached.data;
      }

      // Fetch from database and external APIs
      const [databaseResults, externalResults] = await Promise.all([
        // Database search by category
        fetch(`/api/products?category=${encodeURIComponent(category)}`)
          .then(res => res.json())
          .then(data => data.products || [])
          .catch(() => []),
        
        // External API search by category
        category !== 'all' ? fetch(`/api/search/external?q=${encodeURIComponent(category)}&category=${encodeURIComponent(category)}&maxResults=15`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              const allExternalProducts: any[] = [];
              Object.values(data.platformResults).forEach((platformResult: any) => {
                if (platformResult.success && platformResult.products) {
                  allExternalProducts.push(...platformResult.products);
                }
              });
              return allExternalProducts.map(convertExternalToProduct);
            }
            return [];
          })
          .catch(() => []) : Promise.resolve([])
      ]);

      const combinedResults = [...databaseResults, ...externalResults];
      
      // Deduplicate and sort
      const uniqueResults = combinedResults.filter((product: Product, index: number, self: Product[]) => {
        return index === self.findIndex((p: Product) => 
          p.title.toLowerCase().trim() === product.title.toLowerCase().trim()
        );
      });

      const sortedResults = uniqueResults.sort((a: Product, b: Product) => {
        if (a.platform && !b.platform) return 1;
        if (!a.platform && b.platform) return -1;
        return (b.rating * Math.log(b.reviews + 1)) - (a.rating * Math.log(a.reviews + 1));
      });

      // Cache results with timestamp
      setCachedResults(prev => ({
        ...prev,
        [cacheKey]: {
          data: sortedResults,
          timestamp: Date.now()
        }
      }));

      setIsLoading(false);
      return sortedResults;
      
    } catch (error) {
      console.error('Category search error:', error);
      setIsLoading(false);
      return [];
    }
  };

  const getPopularProducts = async (): Promise<Product[]> => {
    setIsLoading(true);
    
    try {
      // Check cache first with timestamp
      const cacheKey = 'popular_products';
      const cached = cachedResults[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setIsLoading(false);
        return cached.data;
      }

      // Get trending/popular products from deals API
      const results = await fetch('/api/search/deals?type=rated&limit=8')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.deals) {
            return data.deals.map(convertExternalToProduct);
          }
          return [];
        })
        .catch(() => []);

      // Cache results with timestamp
      setCachedResults(prev => ({
        ...prev,
        [cacheKey]: {
          data: results,
          timestamp: Date.now()
        }
      }));

      setIsLoading(false);
      return results;
      
    } catch (error) {
      console.error('Popular products error:', error);
      setIsLoading(false);
      return [];
    }
  };

  return {
    searchProducts,
    getProductsByCategory,
    getPopularProducts,
    isLoading
  };
}
