'use client';

import { useState } from 'react';
import { Search, ShoppingBag, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Mock popular searches
const popularSearches = [
  { text: "Nike Air Max", link: "#" },
  { text: "Chloé Paddington Leather Shoulder Bag", link: "#" },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Dark bar at top */}
      <header className="bg-[var(--header-bg)] text-[var(--header-text)] py-3">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Left Navigation */}
            <nav className="flex items-center space-x-8 text-sm">
              <a href="#" className="hover:opacity-75 transition-opacity">WARDROBE AI</a>
              <a href="#" className="hover:opacity-75 transition-opacity">MY WISHLIST</a>
              <a href="#" className="hover:opacity-75 transition-opacity">CONTACT US</a>
              <Link href="/demo" className="bg-white/20 text-white px-3 py-1 rounded-full hover:bg-white/30 transition-colors font-medium border border-white/30">
                DEMO
              </Link>
            </nav>
            
            {/* Center Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-xl font-bold tracking-wider">
                STYL
                <span className="inline-block transform scale-x-[-1]">E</span>
                LINK
              </h1>
            </div>
            
            {/* Right Navigation */}
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/auth" className="hover:opacity-75 transition-opacity flex items-center">
                <User className="w-4 h-4 mr-1" />
                Log In
              </Link>
              <a href="#" className="hover:opacity-75 transition-opacity flex items-center">
                <ShoppingBag className="w-4 h-4 mr-1" />
                My Cart
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-6xl lg:text-7xl font-bold tracking-tight text-primary mb-6">
                STYL
                <span className="inline-block transform scale-x-[-1]">E</span>
                LINK
              </h2>
              <div className="space-y-2 text-lg text-muted-foreground">
                <p>Personal style, refined</p>
                <p>by intelligence.</p>
              </div>
            </div>
          </div>
          
          {/* Right Side - Fashion Image */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-lg overflow-hidden relative">
              <Image
                src="/hero-fashion.jpg.png"
                alt="Stylish woman in orange sunglasses and oversized white shirt - StyleLink fashion inspiration"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                priority
              />
              {/* Elegant overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              
              {/* Stylish overlay text */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-lg font-bold text-primary mb-1">Style Intelligence</h3>
                  <p className="text-sm text-muted-foreground">Where fashion meets technology</p>
                </div>
              </div>
              
              {/* Floating accent dots */}
              <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-white/30 animate-pulse"></div>
              <div className="absolute top-1/3 left-6 w-2 h-2 rounded-full bg-white/20 animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
        
        {/* Search Section */}
        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for any product across hundreds of retailers..."
                  className="w-full px-6 py-4 rounded-full border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-secondary rounded-full transition-colors">
                  <Search className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
            
            {/* Popular Searches */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-4">
                {popularSearches.map((search, index) => (
                  <a
                    key={index}
                    href={search.link}
                    className="text-sm text-primary hover:underline underline-offset-4 decoration-1"
                  >
                    {search.text}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Style Inspiration Section */}
        <div className="mt-24 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-primary mb-4">Find Your Style Inspiration</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the looks that inspire you, then find the perfect pieces to make them your own
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
