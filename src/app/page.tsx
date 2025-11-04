'use client';

import { useState } from 'react';
import { Search, ShoppingBag, User } from 'lucide-react';

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
              <a href="#" className="hover:opacity-75 transition-opacity flex items-center">
                <User className="w-4 h-4 mr-1" />
                Log In
              </a>
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
            <div className="aspect-[3/4] bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg overflow-hidden">
              {/* Placeholder for fashion photography */}
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p className="text-sm">Fashion Photography</p>
                  <p className="text-xs mt-1">(Trench coat styling)</p>
                </div>
              </div>
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
