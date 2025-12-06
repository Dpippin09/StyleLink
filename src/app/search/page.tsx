'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, Grid, List, Heart, Star, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearch, type Product } from '@/hooks/useSearch';
import MobileHeader from '@/components/MobileHeader';
import Footer from '@/components/Footer';
import SearchWithSuggestions from '@/components/SearchWithSuggestions';

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { searchProducts, isLoading: searchLoading } = useSearch();
  
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const performSearch = async () => {
      if (query) {
        setLoading(true);
        const searchResults = await searchProducts(query);
        setResults(searchResults);
        setLoading(false);
      }
    };
    
    performSearch();
  }, [query, searchProducts]);

  const filteredAndSortedResults = results
    .filter(item => filterCategory === 'all' || item.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });

  const categories = ['all', 'Tops', 'Outerwear', 'Knitwear', 'Bottoms'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MobileHeader />

      <div className="container mx-auto px-6 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {loading ? 'Searching...' : `Search Results for "${query}"`}
          </h1>
          {!loading && (
            <p className="text-muted-foreground">
              {filteredAndSortedResults.length} products found across {new Set(results.map(r => r.retailer)).size} retailers
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-secondary rounded-lg mb-4"></div>
                <div className="h-4 bg-secondary rounded mb-2"></div>
                <div className="h-3 bg-secondary rounded w-2/3 mb-1"></div>
                <div className="h-3 bg-secondary rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-4 bg-card rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select 
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-background border border-border rounded px-3 py-1 text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>
                
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-background border border-border rounded px-3 py-1 text-sm"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Results */}
            {filteredAndSortedResults.length === 0 ? (
              <div className="text-center py-12 space-y-6">
                <div>
                  <p className="text-xl text-muted-foreground mb-2">No products found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </div>
                
                {/* Search Again Section */}
                <div className="max-w-md mx-auto space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Try a new search</h3>
                  <SearchWithSuggestions placeholder="Search for different products..." />
                </div>
                
                {/* Popular Search Suggestions */}
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Popular searches:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['shirts', 'dresses', 'jeans', 'sneakers', 'jackets'].map((term) => (
                      <Link
                        key={term}
                        href={`/search?q=${encodeURIComponent(term)}`}
                        className="px-3 py-1 bg-secondary hover:bg-secondary/80 rounded-full text-sm text-foreground transition-colors"
                      >
                        {term}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-4"
              }>
                {filteredAndSortedResults.map((item) => (
                  <div key={item.id} className={viewMode === 'grid' 
                    ? "group cursor-pointer" 
                    : "flex gap-4 p-4 bg-card rounded-lg hover:bg-card/80 transition-colors"
                  }>
                    <div className={viewMode === 'grid' 
                      ? "aspect-square overflow-hidden rounded-lg bg-secondary mb-4 relative" 
                      : "w-24 h-24 overflow-hidden rounded-lg bg-secondary relative flex-shrink-0"
                    }>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`font-medium text-foreground mb-1 ${viewMode === 'grid' ? 'text-sm' : 'text-base'}`}>
                            {item.title}
                          </h3>
                          <p className={`text-muted-foreground ${viewMode === 'grid' ? 'text-xs' : 'text-sm'}`}>
                            {item.brand} • {item.retailer}
                          </p>
                        </div>
                        <button className="text-muted-foreground hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className={`ml-1 text-muted-foreground ${viewMode === 'grid' ? 'text-xs' : 'text-sm'}`}>
                            {item.rating} ({item.reviews})
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-primary ${viewMode === 'grid' ? 'text-sm' : 'text-base'}`}>
                            ${item.price}
                          </span>
                          {item.originalPrice && (
                            <span className={`line-through text-muted-foreground ${viewMode === 'grid' ? 'text-xs' : 'text-sm'}`}>
                              ${item.originalPrice}
                            </span>
                          )}
                        </div>
                        {viewMode === 'list' && (
                          <button 
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              item.inStock 
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                                : 'bg-secondary text-muted-foreground cursor-not-allowed'
                            }`}
                            disabled={!item.inStock}
                          >
                            {item.inStock ? 'View Deal' : 'Out of Stock'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading search results...</p>
      </div>
    </div>}>
      <SearchResults />
    </Suspense>
  );
}
