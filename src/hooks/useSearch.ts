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
  const [cachedResults, setCachedResults] = useState<{ [key: string]: Product[] }>({});
  
  const searchProducts = async (query: string): Promise<Product[]> => {
    setIsLoading(true);
    
    try {
      // Check cache first
      const cacheKey = `search_${query.toLowerCase()}`;
      if (cachedResults[cacheKey]) {
        setIsLoading(false);
        return cachedResults[cacheKey];
      }

      // Search both database products and external APIs
      const [databaseResults, externalResults] = await Promise.all([
        // Database search
        fetch(`/api/products?search=${encodeURIComponent(query)}`)
          .then(res => res.json())
          .then(data => data.products || [])
          .catch(() => []),
        
        // External API search
        fetch(`/api/search/external?q=${encodeURIComponent(query)}&maxResults=20`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              // Combine all products from different platforms
              const allExternalProducts: any[] = [];
              Object.values(data.results).forEach((platformResult: any) => {
                if (platformResult.success && platformResult.products) {
                  allExternalProducts.push(...platformResult.products);
                }
              });
              return allExternalProducts.map(convertExternalToProduct);
            }
            return [];
          })
          .catch(() => [])
      ]);

      // Combine and deduplicate results
      const combinedResults = [...databaseResults, ...externalResults];
      
      // Simple deduplication based on title similarity
      const uniqueResults = combinedResults.filter((product, index, self) => {
        return index === self.findIndex(p => 
          p.title.toLowerCase().trim() === product.title.toLowerCase().trim()
        );
      });

      // Sort by relevance (database results first, then external by rating)
      const sortedResults = uniqueResults.sort((a, b) => {
        // Prioritize database results
        if (a.platform && !b.platform) return 1;
        if (!a.platform && b.platform) return -1;
        
        // Then by rating * reviews
        return (b.rating * Math.log(b.reviews + 1)) - (a.rating * Math.log(a.reviews + 1));
      });

      // Cache results
      setCachedResults(prev => ({
        ...prev,
        [cacheKey]: sortedResults
      }));

      setIsLoading(false);
      return sortedResults;
      
    } catch (error) {
      console.error('Search error:', error);
      setIsLoading(false);
      return [];
    }
  };

  const getProductsByCategory = async (category: string): Promise<Product[]> => {
    setIsLoading(true);
    
    try {
      // Check cache first
      const cacheKey = `category_${category.toLowerCase()}`;
      if (cachedResults[cacheKey]) {
        setIsLoading(false);
        return cachedResults[cacheKey];
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
              Object.values(data.results).forEach((platformResult: any) => {
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
      const uniqueResults = combinedResults.filter((product, index, self) => {
        return index === self.findIndex(p => 
          p.title.toLowerCase().trim() === product.title.toLowerCase().trim()
        );
      });

      const sortedResults = uniqueResults.sort((a, b) => {
        if (a.platform && !b.platform) return 1;
        if (!a.platform && b.platform) return -1;
        return (b.rating * Math.log(b.reviews + 1)) - (a.rating * Math.log(a.reviews + 1));
      });

      // Cache results
      setCachedResults(prev => ({
        ...prev,
        [cacheKey]: sortedResults
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
      // Check cache first
      const cacheKey = 'popular_products';
      if (cachedResults[cacheKey]) {
        setIsLoading(false);
        return cachedResults[cacheKey];
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

      // Cache results
      setCachedResults(prev => ({
        ...prev,
        [cacheKey]: results
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
