'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Product, parseColors } from '@/lib/products';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
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

  const formatPrice = (price: number, originalPrice?: number | null) => {
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
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Featured Collection</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover handpicked pieces from top brands and retailers
            </p>
          </div>
          
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Products Available Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Our featured products will appear here once we connect to retailer APIs and add inventory.
                </p>
                <p className="text-sm text-muted-foreground">
                  Try using the search feature to find items from our external partners.
                </p>
              </div>
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
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Featured Collection</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover handpicked pieces from top brands and retailers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const pricing = formatPrice(product.price, product.originalPrice);
            const colors = parseColors(product.colors);
            const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
            
            return (
              <div key={product.id} className="group relative bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border">
                {/* Product Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  {primaryImage && (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt || product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  
                  {/* Discount Badge */}
                  {pricing.discount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                      -{pricing.discount}%
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        wishlist.has(product.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-600 hover:text-red-500'
                      }`} 
                    />
                  </button>

                  {/* Quick Actions */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <Link
                        href={`/checkout?${new URLSearchParams({
                          productId: product.id,
                          productName: product.name,
                          productPrice: (product.price * 100).toString(),
                          productImage: primaryImage?.url || '',
                          productBrand: product.brand.name
                        }).toString()}`}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium text-center hover:bg-green-700 transition-colors"
                      >
                        Buy Now
                      </Link>
                      <Link
                        href={`/products/${product.slug}`}
                        className="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium text-center hover:bg-primary/90 transition-colors"
                      >
                        View Details
                      </Link>
                      {product.sourceUrl && (
                        <a
                          href={product.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                          title="View on retailer site"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-2">
                  {/* Brand */}
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    {product.brand.name}
                  </p>

                  {/* Product Name */}
                  <h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
                    {product.name}
                  </h3>

                  {/* Colors */}
                  {colors.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Colors:</span>
                      <span className="text-xs text-foreground">{colors.slice(0, 3).join(', ')}</span>
                      {colors.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{colors.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-lg font-bold text-primary">{pricing.current}</span>
                    {pricing.original && (
                      <span className="text-sm text-muted-foreground line-through">
                        {pricing.original}
                      </span>
                    )}
                  </div>

                  {/* Category */}
                  <p className="text-xs text-muted-foreground">
                    {product.category.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
