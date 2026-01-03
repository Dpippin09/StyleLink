'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  website?: string;
  productCount: number;
  priceRange: {
    min: number;
    max: number;
  };
  logo?: string;
}

interface FeaturedBrandsProps {
  brands: Brand[];
}

export default function FeaturedBrands({ brands }: FeaturedBrandsProps) {
  const formatPriceRange = (min: number, max: number) => {
    return `$${min} - $${max}`;
  };

  const getBrandCategory = (name: string) => {
    const athletic = ['Nike', 'Adidas', 'Lululemon'];
    const luxury = ['Massimo Dutti', 'COS', 'Banana Republic'];
    const casual = ['Gap', 'Levi\'s', 'American Eagle'];
    const fast = ['H&M', 'Zara', 'Forever 21'];
    const denim = ['Buckle'];
    const outlet = ['Nordstrom Rack'];
    
    if (athletic.includes(name)) return 'Athletic';
    if (luxury.includes(name)) return 'Premium';
    if (casual.includes(name)) return 'Casual';
    if (fast.includes(name)) return 'Contemporary';
    if (denim.includes(name)) return 'Denim';
    if (outlet.includes(name)) return 'Outlet';
    return 'Fashion';
  };

  const getBrandColors = (name: string) => {
    switch (name) {
      case 'Nike':
        return 'from-black to-gray-800 text-white';
      case 'Adidas':
        return 'from-blue-600 to-blue-800 text-white';
      case 'Lululemon':
        return 'from-red-500 to-rose-600 text-white';
      case 'Levi\'s':
        return 'from-red-600 to-red-800 text-white';
      case 'H&M':
        return 'from-red-500 to-pink-600 text-white';
      case 'Zara':
        return 'from-gray-900 to-black text-white';
      case 'Gap':
        return 'from-blue-500 to-indigo-600 text-white';
      case 'COS':
        return 'from-stone-600 to-stone-800 text-white';
      case 'Massimo Dutti':
        return 'from-amber-700 to-amber-900 text-white';
      case 'Buckle':
        return 'from-indigo-600 to-purple-700 text-white';
      case 'American Eagle':
        return 'from-blue-700 to-blue-900 text-white';
      case 'Forever 21':
        return 'from-pink-500 to-purple-600 text-white';
      case 'Banana Republic':
        return 'from-green-700 to-emerald-800 text-white';
      case 'Nordstrom Rack':
        return 'from-slate-700 to-gray-900 text-white';
      default:
        return 'from-primary to-primary/80 text-white';
    }
  };

  if (brands.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No brands found.</p>
      </div>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Featured Brands</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore collections from the world's most coveted fashion brands
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <a
              key={brand.id}
              href={brand.website ? (brand.website.startsWith('http') ? brand.website : `https://${brand.website}`) : `/brand/${brand.slug}`}
              target={brand.website ? "_blank" : "_self"}
              rel={brand.website ? "noopener noreferrer" : undefined}
              className="group block"
            >
              <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                {/* Brand Header */}
                <div className={`bg-gradient-to-r ${getBrandColors(brand.name)} p-6 text-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">{brand.name}</h3>
                    <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                      {getBrandCategory(brand.name)}
                    </span>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full transform translate-x-10 -translate-y-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-8 translate-y-8"></div>
                </div>

                {/* Brand Content */}
                <div className="p-6">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {brand.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Products</span>
                      <span className="font-medium">{brand.productCount}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Price Range</span>
                      <span className="font-medium">
                        {formatPriceRange(brand.priceRange.min, brand.priceRange.max)}
                      </span>
                    </div>
                  </div>

                  {/* Shop Button */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <span className="font-medium">Visit Official Store</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* View All Brands */}
        <div className="text-center mt-12">
          <Link
            href="/brands"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <span>Explore All Brands</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
