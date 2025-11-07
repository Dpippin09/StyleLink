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
}

// Extended mock data with more products
export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Oversized White Cotton Shirt',
    brand: 'Everlane',
    price: 68,
    originalPrice: 85,
    rating: 4.5,
    reviews: 234,
    image: '/hero-fashion.jpg.png',
    retailer: 'Everlane',
    category: 'Tops',
    inStock: true,
    description: 'A classic oversized cotton shirt perfect for layering',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Black']
  },
  {
    id: '2',
    title: 'Beige Wool Coat',
    brand: 'COS',
    price: 295,
    rating: 4.8,
    reviews: 89,
    image: '/man-beige-coat.jpg.png',
    retailer: 'COS',
    category: 'Outerwear',
    inStock: true,
    description: 'Elegant wool blend coat with minimalist design',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Navy', 'Black']
  },
  {
    id: '3',
    title: 'Cashmere Cardigan',
    brand: 'Uniqlo',
    price: 99.90,
    originalPrice: 129.90,
    rating: 4.3,
    reviews: 156,
    image: '/woman-cardigan.jpg.png',
    retailer: 'Uniqlo',
    category: 'Knitwear',
    inStock: true,
    description: 'Luxuriously soft cashmere cardigan for elegant comfort',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Cream', 'Grey', 'Black']
  },
  {
    id: '4',
    title: 'Classic White Button-Down',
    brand: 'ARKET',
    price: 49,
    rating: 4.6,
    reviews: 312,
    image: '/hero-fashion.jpg.png',
    retailer: 'ARKET',
    category: 'Tops',
    inStock: false,
    description: 'Timeless white button-down shirt in sustainable cotton',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White']
  },
  {
    id: '5',
    title: 'Wool Blend Coat',
    brand: 'Massimo Dutti',
    price: 219,
    rating: 4.7,
    reviews: 78,
    image: '/man-beige-coat.jpg.png',
    retailer: 'Massimo Dutti',
    category: 'Outerwear',
    inStock: true,
    description: 'Sophisticated wool blend coat with tailored fit',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Beige', 'Charcoal', 'Navy']
  },
  {
    id: '6',
    title: 'Knit Cardigan',
    brand: 'Zara',
    price: 35.95,
    rating: 4.1,
    reviews: 203,
    image: '/woman-cardigan.jpg.png',
    retailer: 'Zara',
    category: 'Knitwear',
    inStock: true,
    description: 'Cozy knit cardigan with button closure',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Cream', 'Pink', 'Green']
  },
  {
    id: '7',
    title: 'Premium White Shirt',
    brand: 'COS',
    price: 79,
    rating: 4.4,
    reviews: 167,
    image: '/hero-fashion.jpg.png',
    retailer: 'COS',
    category: 'Tops',
    inStock: true,
    description: 'Premium cotton shirt with contemporary cut',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Light Blue']
  },
  {
    id: '8',
    title: 'Designer Jeans',
    brand: 'Citizens of Humanity',
    price: 198,
    originalPrice: 248,
    rating: 4.6,
    reviews: 445,
    image: '/hero-fashion.jpg.png',
    retailer: 'Nordstrom',
    category: 'Bottoms',
    inStock: true,
    description: 'High-waisted designer jeans with perfect fit',
    sizes: ['24', '25', '26', '27', '28', '29', '30'],
    colors: ['Dark Wash', 'Light Wash', 'Black']
  }
];

export function useSearch() {
  const [isLoading, setIsLoading] = useState(false);
  
  const searchProducts = async (query: string): Promise<Product[]> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const results = mockProducts.filter(product => {
      const searchLower = query.toLowerCase();
      return (
        product.title.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.colors?.some(color => color.toLowerCase().includes(searchLower))
      );
    });
    
    setIsLoading(false);
    return results;
  };

  const getProductsByCategory = (category: string): Product[] => {
    if (category === 'all') return mockProducts;
    return mockProducts.filter(product => product.category === category);
  };

  const getPopularProducts = (): Product[] => {
    return mockProducts
      .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
      .slice(0, 4);
  };

  return {
    searchProducts,
    getProductsByCategory,
    getPopularProducts,
    isLoading
  };
}
