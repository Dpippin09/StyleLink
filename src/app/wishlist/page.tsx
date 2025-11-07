'use client';

import { useState } from 'react';
import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Filter, Grid, List, Search, X, ExternalLink, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface WishlistItem {
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
  dateAdded: string;
  sizes?: string[];
  colors?: string[];
  description?: string;
  isSale?: boolean;
}

// Mock wishlist data
const mockWishlistItems: WishlistItem[] = [
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
    dateAdded: '2024-10-15',
    description: 'Classic oversized cotton shirt perfect for layering',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Black'],
    isSale: true
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
    dateAdded: '2024-10-20',
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
    inStock: false,
    dateAdded: '2024-11-01',
    description: 'Luxuriously soft cashmere cardigan',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Cream', 'Grey', 'Black'],
    isSale: true
  },
  {
    id: '4',
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
    dateAdded: '2024-10-28',
    description: 'High-waisted designer jeans with perfect fit',
    sizes: ['24', '25', '26', '27', '28', '29', '30'],
    colors: ['Dark Wash', 'Light Wash', 'Black'],
    isSale: true
  },
  {
    id: '5',
    title: 'Silk Blouse',
    brand: 'Equipment',
    price: 168,
    rating: 4.4,
    reviews: 203,
    image: '/hero-fashion.jpg.png',
    retailer: 'Equipment',
    category: 'Tops',
    inStock: true,
    dateAdded: '2024-11-05',
    description: 'Elegant silk blouse for sophisticated looks',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Ivory', 'Black', 'Navy']
  },
  {
    id: '6',
    title: 'Ankle Boots',
    brand: 'Stuart Weitzman',
    price: 425,
    rating: 4.7,
    reviews: 89,
    image: '/man-beige-coat.jpg.png',
    retailer: 'Stuart Weitzman',
    category: 'Shoes',
    inStock: true,
    dateAdded: '2024-10-10',
    description: 'Classic leather ankle boots',
    sizes: ['6', '7', '8', '9', '10'],
    colors: ['Black', 'Brown', 'Tan']
  }
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', 'Tops', 'Outerwear', 'Knitwear', 'Bottoms', 'Shoes'];

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(items => items.filter(item => item.id !== itemId));
  };

  const filteredAndSortedItems = wishlistItems
    .filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dateAdded': return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'name': return a.title.localeCompare(b.title);
        case 'brand': return a.brand.localeCompare(b.brand);
        default: return 0;
      }
    });

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  const saleItems = wishlistItems.filter(item => item.isSale).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[var(--header-bg)] text-[var(--header-text)] py-3">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-sm hover:opacity-75 transition-opacity">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to StyleLink
            </Link>
            
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-xl font-bold tracking-wider">
                STYL
                <span className="inline-block transform scale-x-[-1]">E</span>
                LINK
              </h1>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="hover:opacity-75 transition-opacity">WARDROBE AI</a>
              <span className="text-primary font-medium">MY WISHLIST</span>
              <Link href="/contact" className="hover:opacity-75 transition-opacity">CONTACT US</Link>
              <Link href="/cart" className="relative hover:opacity-75 transition-opacity">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 mb-6">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">My Wishlist</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {wishlistItems.length} items • Total value: ${totalValue.toLocaleString()}
                {saleItems > 0 && <span className="text-green-600 block sm:inline sm:ml-2">• {saleItems} on sale</span>}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button className="flex items-center justify-center gap-2 bg-secondary text-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                <Share2 className="w-4 h-4" />
                Share Wishlist
              </button>
              <button className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Shop All
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-card rounded-lg p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-primary">{wishlistItems.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Items</p>
            </div>
            <div className="bg-card rounded-lg p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-primary">${totalValue.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Value</p>
            </div>
            <div className="bg-card rounded-lg p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-green-600">{saleItems}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">On Sale</p>
            </div>
            <div className="bg-card rounded-lg p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-primary">{wishlistItems.filter(item => item.inStock).length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">In Stock</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search wishlist items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm min-w-[120px]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm min-w-[140px]"
              >
                <option value="dateAdded">Recently Added</option>
                <option value="name">Name A-Z</option>
                <option value="brand">Brand A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              
              <div className="flex items-center gap-2 border-l border-border pl-4">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        {filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {wishlistItems.length === 0 ? 'Your wishlist is empty' : 'No items match your search'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {wishlistItems.length === 0 
                ? 'Start building your dream wardrobe by adding items you love!'
                : 'Try adjusting your filters or search terms to find items.'
              }
            </p>
            <Link 
              href="/search?q=fashion" 
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Explore Fashion
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredAndSortedItems.map((item) => (
              <div key={item.id} className={viewMode === 'grid'
                ? 'bg-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group relative'
                : 'bg-card rounded-xl p-4 hover:shadow-lg transition-all duration-300 flex items-center gap-4 relative'
              }>
                {/* Sale Badge */}
                {item.isSale && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium z-10">
                    SALE
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-red-500 hover:text-white text-gray-600 p-1.5 rounded-full transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className={viewMode === 'grid'
                  ? 'aspect-square overflow-hidden relative'
                  : 'w-24 h-24 overflow-hidden rounded-lg relative flex-shrink-0'
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

                <div className={viewMode === 'grid' ? 'p-4' : 'flex-1'}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className={`font-semibold text-foreground mb-1 ${viewMode === 'grid' ? 'text-sm' : 'text-base'}`}>
                        {item.title}
                      </h3>
                      <p className={`text-muted-foreground ${viewMode === 'grid' ? 'text-xs' : 'text-sm'}`}>
                        {item.brand} • {item.retailer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className={`ml-1 text-muted-foreground ${viewMode === 'grid' ? 'text-xs' : 'text-sm'}`}>
                        {item.rating} ({item.reviews})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
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
                    <span className={`text-muted-foreground ${viewMode === 'grid' ? 'text-xs' : 'text-sm'}`}>
                      Added {new Date(item.dateAdded).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                        item.inStock 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                          : 'bg-secondary text-muted-foreground cursor-not-allowed'
                      }`}
                      disabled={!item.inStock}
                    >
                      <ShoppingBag className="w-3 h-3 inline mr-1" />
                      {item.inStock ? 'Shop Now' : 'Out of Stock'}
                    </button>
                    <button className="p-2 bg-secondary hover:bg-secondary/80 rounded text-muted-foreground transition-colors">
                      <Eye className="w-3 h-3" />
                    </button>
                    <button className="p-2 bg-secondary hover:bg-secondary/80 rounded text-muted-foreground transition-colors">
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
