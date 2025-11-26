'use client';

import { useState } from 'react';
import { Search, ShoppingBag, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HeroCarousel from '@/components/HeroCarousel';
import SearchWithSuggestions from '@/components/SearchWithSuggestions';
import MobileHeader from '@/components/MobileHeader';

// Mock popular searches
const popularSearches = [
  { text: "White shirts", link: "#" },
  { text: "Wool coats", link: "#" },
  { text: "Cashmere cardigans", link: "#" },
  { text: "Designer jeans", link: "#" },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handlePopularSearch = (searchText: string) => {
    router.push(`/search?q=${encodeURIComponent(searchText)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MobileHeader currentPage="home" />

      {/* Main Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[50vh] sm:min-h-[60vh]">
          {/* Left Side - Text Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-primary mb-4 sm:mb-6">
                STYL
                <span className="inline-block transform scale-x-[-1]">E</span>
                LINK
              </h2>
              <div className="space-y-2 text-base sm:text-lg text-muted-foreground">
                <p>Personal style, refined</p>
                <p>by intelligence.</p>
              </div>
            </div>
          </div>
          
          {/* Right Side - Fashion Image Carousel */}
          <div className="relative order-1 lg:order-2">
            <HeroCarousel autoPlay={true} interval={4000} />
          </div>
        </div>
        
        {/* Search Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="max-w-2xl mx-auto px-4">
            {/* Search Bar with Suggestions */}
            <div className="mb-6">
              <SearchWithSuggestions />
            </div>
            
            {/* Popular Searches */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularSearch(search.text)}
                    className="text-xs sm:text-sm text-primary hover:underline underline-offset-4 decoration-1 cursor-pointer px-2 py-1"
                  >
                    {search.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Style Inspiration Section */}
        <div className="mt-16 sm:mt-24 mb-16 sm:mb-20 px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-4">Find Your Style Inspiration</h3>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Discover the looks that inspire you, then find the perfect pieces to make them your own
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Inspiration Image 1 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary mb-4">
                <Image
                  src="/woman-sunglasses.jpg"
                  alt="Effortless chic style with oversized white shirt and orange sunglasses"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur rounded-lg p-3">
                    <h4 className="font-semibold text-primary text-sm">Effortless Chic</h4>
                    <p className="text-xs text-muted-foreground">Oversized shirts & statement accessories</p>
                  </div>
                </div>
              </div>
              <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                Shop This Look
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Inspiration Image 2 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary mb-4">
                <Image
                  src="/man-beige-coat.jpg"
                  alt="Modern minimalist style with flowing beige coat"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur rounded-lg p-3">
                    <h4 className="font-semibold text-primary text-sm">Modern Minimalism</h4>
                    <p className="text-xs text-muted-foreground">Clean lines & neutral tones</p>
                  </div>
                </div>
              </div>
              <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                Shop This Look
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Inspiration Image 3 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary mb-4">
                <Image
                  src="/woman-cardigan.jpg"
                  alt="Classic layering with black camisole and white cardigan"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur rounded-lg p-3">
                    <h4 className="font-semibold text-primary text-sm">Timeless Elegance</h4>
                    <p className="text-xs text-muted-foreground">Perfect layering & classic pieces</p>
                  </div>
                </div>
              </div>
              <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                Shop This Look
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Product Preview Section */}
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product placeholders matching the bottom of your image */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-secondary rounded-lg overflow-hidden mb-3">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <p className="text-xs">Product {item}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-primary group-hover:underline underline-offset-2">
                    Product Title {item}
                  </h3>
                  <p className="text-xs text-muted-foreground">Brand Name</p>
                  <p className="text-sm font-semibold text-primary">$299</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
