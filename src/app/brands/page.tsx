import { Metadata } from 'next';
import MobileHeader from '@/components/MobileHeader';
import Footer from '@/components/Footer';
import AllBrandsGrid from '../../components/AllBrandsGrid';
import { getAllBrands } from '@/lib/brands';

export const metadata: Metadata = {
  title: 'All Brands | StyleLink',
  description: 'Discover all fashion brands available on StyleLink',
};

export default async function BrandsPage() {
  const brandsResponse = await getAllBrands();
  const brands = brandsResponse.success ? brandsResponse.data : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MobileHeader currentPage="brands" />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
            All Brands
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our complete collection of fashion brands from around the world
          </p>
          <div className="mt-6 text-sm text-muted-foreground">
            {brands.length} brands available
          </div>
        </div>

        {/* Brands Grid */}
        <AllBrandsGrid brands={brands} />
      </main>
      
      <Footer />
    </div>
  );
}
