const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to create slug from name
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

async function addNewRetailBrands() {
  try {
    console.log('🌱 Adding Forever 21, Banana Republic, and Nordstrom Rack...');

    // Define the new brands to add
    const newBrands = [
      {
        name: 'Forever 21',
        slug: 'forever-21',
        description: 'Trendy, affordable fashion for the latest styles and seasonal must-haves',
        website: 'https://forever21.com'
      },
      {
        name: 'Banana Republic',
        slug: 'banana-republic',
        description: 'Modern, versatile clothing for work and life with timeless sophistication',
        website: 'https://bananarepublic.gap.com'
      },
      {
        name: 'Nordstrom Rack',
        slug: 'nordstrom-rack',
        description: 'Designer and brand name fashion at up to 70% off with new arrivals daily',
        website: 'https://nordstromrack.com'
      }
    ];

    // Get existing categories
    const categories = await prisma.category.findMany();
    const clothingCategory = categories.find(cat => cat.slug === 'clothing');
    const topsCategory = categories.find(cat => cat.slug === 'tops');
    const bottomsCategory = categories.find(cat => cat.slug === 'bottoms');
    const dressesCategory = categories.find(cat => cat.slug === 'dresses');
    
    if (!clothingCategory || !topsCategory || !bottomsCategory || !dressesCategory) {
      throw new Error('Required categories not found');
    }

    for (const brandData of newBrands) {
      console.log(`Adding brand: ${brandData.name}...`);

      // Check if brand already exists
      const existingBrand = await prisma.brand.findUnique({
        where: { slug: brandData.slug }
      });

      if (existingBrand) {
        console.log(`  ⚠️  Brand ${brandData.name} already exists, skipping...`);
        continue;
      }

      // Create the brand
      const brand = await prisma.brand.create({
        data: brandData
      });

      // Add sample products for each brand
      let products = [];
      
      if (brandData.name === 'Forever 21') {
        products = [
          {
            name: 'Cropped Graphic Tee',
            slug: createSlug('forever-21-cropped-graphic-tee'),
            description: 'Trendy cropped tee with vintage-inspired graphics',
            price: 12.90,
            brandId: brand.id,
            categoryId: topsCategory.id,
            image: 'https://www.forever21.com/dw/image/v2/BFKH_PRD/on/demandware.static/-/Sites-f21-master-catalog/default/dw8f8a8c8d/hi-res/00466729-01.jpg'
          },
          {
            name: 'High-Waist Straight Jeans',
            slug: createSlug('forever-21-high-waist-straight-jeans'),
            description: 'Classic straight-leg jeans with high-waist silhouette',
            price: 19.90,
            brandId: brand.id,
            categoryId: bottomsCategory.id,
            image: 'https://www.forever21.com/dw/image/v2/BFKH_PRD/on/demandware.static/-/Sites-f21-master-catalog/default/dw1a2b3c4d/hi-res/00398476-01.jpg'
          },
          {
            name: 'Satin Mini Dress',
            slug: createSlug('forever-21-satin-mini-dress'),
            description: 'Flirty satin mini dress perfect for nights out',
            price: 24.90,
            brandId: brand.id,
            categoryId: dressesCategory.id,
            image: 'https://www.forever21.com/dw/image/v2/BFKH_PRD/on/demandware.static/-/Sites-f21-master-catalog/default/dw5e6f7g8h/hi-res/00445382-01.jpg'
          },
          {
            name: 'Oversized Denim Jacket',
            slug: createSlug('forever-21-oversized-denim-jacket'),
            description: 'Classic oversized denim jacket with distressed details',
            price: 29.90,
            brandId: brand.id,
            categoryId: clothingCategory.id,
            image: 'https://www.forever21.com/dw/image/v2/BFKH_PRD/on/demandware.static/-/Sites-f21-master-catalog/default/dw9i0j1k2l/hi-res/00412098-01.jpg'
          }
        ];
      } else if (brandData.name === 'Banana Republic') {
        products = [
          {
            name: 'Italian Merino Crew Sweater',
            slug: createSlug('banana-republic-italian-merino-crew-sweater'),
            description: 'Luxury Italian merino wool sweater with timeless design',
            price: 89.95,
            brandId: brand.id,
            categoryId: topsCategory.id,
            image: 'https://bananarepublic.gap.com/webcontent/0054/070/346/cn54070346.jpg'
          },
          {
            name: 'Traveler Slim Chino',
            slug: createSlug('banana-republic-traveler-slim-chino'),
            description: 'Versatile chinos perfect for work and weekend',
            price: 79.95,
            brandId: brand.id,
            categoryId: bottomsCategory.id,
            image: 'https://bananarepublic.gap.com/webcontent/0054/282/103/cn54282103.jpg'
          },
          {
            name: 'Silk Wrap Dress',
            slug: createSlug('banana-republic-silk-wrap-dress'),
            description: 'Elegant silk wrap dress for sophisticated occasions',
            price: 149.95,
            brandId: brand.id,
            categoryId: dressesCategory.id,
            image: 'https://bananarepublic.gap.com/webcontent/0054/471/285/cn54471285.jpg'
          },
          {
            name: 'Italian Wool Blazer',
            slug: createSlug('banana-republic-italian-wool-blazer'),
            description: 'Professional blazer crafted from Italian wool',
            price: 199.95,
            brandId: brand.id,
            categoryId: clothingCategory.id,
            image: 'https://bananarepublic.gap.com/webcontent/0054/319/467/cn54319467.jpg'
          }
        ];
      } else if (brandData.name === 'Nordstrom Rack') {
        products = [
          {
            name: 'Designer Cashmere Sweater',
            slug: createSlug('nordstrom-rack-designer-cashmere-sweater'),
            description: 'Luxury cashmere sweater from top designer brands',
            price: 79.97,
            originalPrice: 198.00,
            brandId: brand.id,
            categoryId: topsCategory.id,
            image: 'https://n.nordstrommedia.com/id/sr3/1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6.jpeg'
          },
          {
            name: 'Premium Denim Jeans',
            slug: createSlug('nordstrom-rack-premium-denim-jeans'),
            description: 'Designer denim at an unbeatable price',
            price: 49.97,
            originalPrice: 168.00,
            brandId: brand.id,
            categoryId: bottomsCategory.id,
            image: 'https://n.nordstrommedia.com/id/sr3/6f7g8h9i-0j1k-2l3m-4n5o-p6q7r8s9t0u1.jpeg'
          },
          {
            name: 'Designer Cocktail Dress',
            slug: createSlug('nordstrom-rack-designer-cocktail-dress'),
            description: 'Elegant designer dress perfect for special occasions',
            price: 89.97,
            originalPrice: 295.00,
            brandId: brand.id,
            categoryId: dressesCategory.id,
            image: 'https://n.nordstrommedia.com/id/sr3/v2w3x4y5-z6a7-b8c9-d0e1-f2g3h4i5j6k7.jpeg'
          },
          {
            name: 'Luxury Handbag',
            slug: createSlug('nordstrom-rack-luxury-handbag'),
            description: 'Designer handbag from premium fashion houses',
            price: 129.97,
            originalPrice: 425.00,
            brandId: brand.id,
            categoryId: clothingCategory.id,
            image: 'https://n.nordstrommedia.com/id/sr3/l8m9n0o1-p2q3-r4s5-t6u7-v8w9x0y1z2a3.jpeg'
          }
        ];
      }

      // Create products for this brand
      for (const productData of products) {
        const productCreateData = {
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          price: productData.price,
          brandId: productData.brandId,
          categoryId: productData.categoryId,
          images: {
            create: [{
              url: productData.image,
              alt: `${productData.name} - Main Image`,
              isPrimary: true,
              order: 0
            }]
          }
        };

        // Add originalPrice if it exists
        if (productData.originalPrice) {
          productCreateData.originalPrice = productData.originalPrice;
        }

        await prisma.product.create({
          data: productCreateData
        });
      }

      console.log(`  ✅ Added ${brandData.name} with ${products.length} products`);
    }

    console.log('✨ Successfully added new retail brands!');
    
    // Display summary
    const totalBrands = await prisma.brand.count();
    const totalProducts = await prisma.product.count();
    
    console.log(`\n📊 Database Summary:`);
    console.log(`   Total Brands: ${totalBrands}`);
    console.log(`   Total Products: ${totalProducts}`);

  } catch (error) {
    console.error('❌ Error adding brands:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addNewRetailBrands();
