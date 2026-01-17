'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MobileHeader from '@/components/MobileHeader';
import Footer from '@/components/Footer';
import SearchWithSuggestions from '@/components/SearchWithSuggestions';
import RealSearchResults from '@/components/RealSearchResults';

function SearchResults() {
  const searchParams = useSearchParams();
  
  const query = searchParams.get('q') || '';

  // Handle wishlist toggle
  const handleToggleWishlist = (product: any) => {
    console.log('Added to price tracking:', product);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MobileHeader 
        currentPage="search" 
      />

      <div className="container mx-auto px-6 py-8">
        {/* Search Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">
            {query ? `Price Comparison for "${query}"` : 'Compare Prices Across Retailers'}
          </h1>
          
          {/* Updated Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchWithSuggestions />
            {query && (
              <p className="text-sm text-muted-foreground mt-2">
                Currently searching for: <strong>{query}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Real Search Results */}
        {query ? (
          <div className="max-w-7xl mx-auto">
            <RealSearchResults 
              query={query}
              onToggleWishlist={handleToggleWishlist}
            />
            
            {/* StyleLink Benefits Banner */}
            <div className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-3">Why Use StyleLink for Price Comparison?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-primary mb-1">� Best Prices Found</div>
                  <p className="text-muted-foreground">We compare prices across all major retailers instantly</p>
                </div>
                <div>
                  <div className="font-medium text-primary mb-1">� Price Tracking</div>
                  <p className="text-muted-foreground">Get alerts when prices drop on your favorite items</p>
                </div>
                <div>
                  <div className="font-medium text-primary mb-1">🔗 Trusted Links</div>
                  <p className="text-muted-foreground">Direct links to official retailers with secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* No Query State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <h2 className="text-2xl font-bold text-muted-foreground">Search Real Fashion Products</h2>
              <p className="text-muted-foreground">
                Find items from top retailers like Amazon, Zara, H&M, ASOS, and Nordstrom
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {['White shirt', 'Black dress', 'Jeans', 'Sneakers', 'Jackets'].map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="px-3 py-2 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading search...</p>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
