import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HeroCarousel from '@/components/HeroCarousel';
import SearchWithSuggestions from '@/components/SearchWithSuggestions';
import MobileHeader from '@/components/MobileHeader';
import Footer from '@/components/Footer';
import FeaturedBrands from '@/components/FeaturedBrands';
import FeaturedProducts from '@/components/FeaturedProducts';
import { getFeaturedBrands } from '@/lib/brands';
import { getFeaturedProducts } from '@/lib/products';

// Mock popular searches
const popularSearches = [
  { text: "White shirts", link: "#" },
  { text: "Wool coats", link: "#" },
  { text: "Cashmere cardigans", link: "#" },
  { text: "Designer jeans", link: "#" },
];

export default async function Home() {
  // Fetch featured brands from database and real products from database
  const [brandsResponse, productsResponse] = await Promise.all([
    getFeaturedBrands(8),
    getFeaturedProducts(8)
  ]);
  
  const featuredBrands = brandsResponse.success ? brandsResponse.data : [];
  const featuredProducts = productsResponse.success ? productsResponse.data : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MobileHeader currentPage="home" />

      {/* Main Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start min-h-[50vh] sm:min-h-[60vh]">
          {/* Left Side - Text Content & Search */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-primary mb-4 sm:mb-6">
                STYL
                <span className="inline-block transform scale-x-[-1]">E</span>
                LINK
              </h2>
              <div className="space-y-2 text-base sm:text-lg text-muted-foreground mb-8">
                <p>Find the best prices</p>
                <p>across all retailers.</p>
                <p className="text-sm text-primary font-medium">Compare • Save • Shop Smart</p>
              </div>
              
              {/* Search Section - Now positioned below tagline */}
              <div className="max-w-md lg:max-w-lg">
                {/* Search Bar with Suggestions */}
                <div className="mb-4">
                  <SearchWithSuggestions />
                </div>
                
                {/* Popular Searches */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Popular searches:</p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
                    {popularSearches.map((search, index) => (
                      <Link
                        key={index}
                        href={`/search?q=${encodeURIComponent(search.text)}`}
                        className="text-xs sm:text-sm text-primary hover:underline underline-offset-4 decoration-1 cursor-pointer px-2 py-1"
                      >
                        {search.text}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Fashion Image Carousel */}
          <div className="relative order-1 lg:order-2">
            <HeroCarousel autoPlay={true} interval={4000} />
          </div>
        </div>
      </main>

      {/* Featured Database Products Section - Real products from PostgreSQL */}
      <FeaturedProducts products={featuredProducts} />

      {/* Featured Brands Section */}
      <FeaturedBrands brands={featuredBrands} />
      
      <Footer />
    </div>
  );
}
