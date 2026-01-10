'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/hooks/useSearch';

interface RealFeaturedProductsProps {
  products: Product[];
}

export default function RealFeaturedProducts({ products }: RealFeaturedProductsProps) {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const formatPrice = (price: number, originalPrice?: number) => {
    return {
      current: `$${price.toFixed(2)}`,
      original: originalPrice ? `$${originalPrice.toFixed(2)}` : null,
      discount: originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null
    };
  };

  if (products.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Featured Real Products</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Live fashion products from eBay marketplace
            </p>
          </div>
          
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Loading Real Products...</h3>
              <p className="text-muted-foreground">
                Fetching live fashion products from eBay. This may take a moment due to API rate limits.
              </p>
              <Link 
                href="/search" 
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Browse All Products <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Featured Real Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Live fashion products sourced directly from eBay marketplace
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => {
            const pricing = formatPrice(product.price, product.originalPrice);
            const isInWishlist = wishlist.has(product.id);

            return (
              <div 
                key={product.id} 
                className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg';
                    }}
                  />
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isInWishlist 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/80 text-muted-foreground hover:bg-white hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>

                  {/* Discount Badge */}
                  {pricing.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      -{pricing.discount}%
                    </div>
                  )}

                  {/* Platform Badge */}
                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    eBay Live
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 space-y-2">
                  {/* Brand */}
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    {product.brand}
                  </p>
                  
                  {/* Title */}
                  <h3 className="font-medium text-sm leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  
                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>⭐ {product.rating.toFixed(1)}</span>
                    <span>·</span>
                    <span>{product.reviews} reviews</span>
                  </div>
                  
                  {/* Pricing */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{pricing.current}</span>
                    {pricing.original && (
                      <span className="text-xs text-muted-foreground line-through">
                        {pricing.original}
                      </span>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  <div className="pt-2">
                    {product.productUrl ? (
                      <a
                        href={product.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-primary text-primary-foreground py-2 px-3 rounded text-xs font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
                      >
                        View on eBay <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <button className="w-full bg-primary text-primary-foreground py-2 px-3 rounded text-xs font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-1">
                        <ShoppingBag className="w-3 h-3" /> Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View More Link */}
        <div className="text-center mt-12">
          <Link 
            href="/search" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Explore All Real Products <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
