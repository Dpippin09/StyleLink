'use client';

import { useState, useCallback } from 'react';

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
}

// Convert external API product format to internal Product format
function convertExternalToProduct(externalProduct: any): Product {
  return {
    id: externalProduct.id || Math.random().toString(36).substr(2, 9),
    title: externalProduct.title || 'Unknown Product',
    brand: externalProduct.brand || 'Unknown Brand',
    price: externalProduct.price || 0,
    originalPrice: externalProduct.originalPrice,
    rating: externalProduct.rating || 0,
    reviews: externalProduct.reviews || 0,
    image: externalProduct.imageUrl || externalProduct.image || '/placeholder-image.jpg',
    retailer: externalProduct.platform || 'External',
    category: externalProduct.category || 'Fashion',
    inStock: externalProduct.inStock !== false,
    description: externalProduct.description,
    sizes: externalProduct.sizes,
    colors: externalProduct.colors,
    platform: externalProduct.platform
  };
}

export function useSearch() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchAll = useCallback(async (query: string): Promise<Product[]> => {
    if (!query.trim()) {
      setProducts([]);
      return [];
    }

    setIsLoading(true);

    try {
      console.log('Searching for:', query);
      
      // Use external search API (eBay integration)
      const response = await fetch(`/api/search/external?q=${encodeURIComponent(query)}&maxResults=20`);
      
      if (!response.ok) {
        throw new Error(`Search API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Search API response:', data);
      
      let results: Product[] = [];
      
      if (data.success && data.platforms && data.platforms.ebay && data.platforms.ebay.products) {
        results = data.platforms.ebay.products.map((product: any) => convertExternalToProduct(product));
        console.log('Converted products:', results.length);
      } else {
        console.log('No eBay products found in response');
      }

      setProducts(results);
      setIsLoading(false);
      return results;
      
    } catch (error) {
      console.error('Search error:', error);
      setProducts([]);
      setIsLoading(false);
      return [];
    }
  }, []);

  const searchProducts = useCallback(async (searchQuery: string): Promise<Product[]> => {
    return await searchAll(searchQuery);
  }, [searchAll]);

  const getProductsByCategory = useCallback(async (category: string): Promise<Product[]> => {
    return await searchAll(category);
  }, [searchAll]);

  const getFeaturedProducts = useCallback(async (): Promise<Product[]> => {
    setIsLoading(true);
    try {
      // For featured products, search for popular fashion terms
      return await searchAll('fashion trending');
    } finally {
      setIsLoading(false);
    }
  }, [searchAll]);

  const getBestDeals = useCallback(async (): Promise<Product[]> => {
    setIsLoading(true);
    try {
      return await searchAll('sale discount');
    } finally {
      setIsLoading(false);
    }
  }, [searchAll]);

  const getTopRated = useCallback(async (): Promise<Product[]> => {
    setIsLoading(true);
    try {
      return await searchAll('top rated');
    } finally {
      setIsLoading(false);
    }
  }, [searchAll]);

  return {
    products,
    isLoading,
    searchAll,
    searchProducts,
    getProductsByCategory,
    getFeaturedProducts,
    getBestDeals,
    getTopRated
  };
}
