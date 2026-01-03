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

async function addNewBrands() {
  try {
    console.log('🌱 Adding new featured brands...');

    // Define the new brands to add
    const newBrands = [
      {
        name: 'Lululemon',
        slug: 'lululemon',
        description: 'Premium athletic wear designed for yoga, running, and active lifestyles',
        website: 'https://lululemon.com'
      },
      {
        name: 'Buckle',
        slug: 'buckle',
        description: 'Contemporary fashion with unique denim, accessories, and trendy styles',
        website: 'https://buckle.com'
      },
      {
        name: 'American Eagle',
        slug: 'american-eagle',
        description: 'Casual clothing and accessories for the effortlessly cool generation',
        website: 'https://ae.com'
      }
    ];

    // Get existing categories
    const categories = await prisma.category.findMany();
    const clothingCategory = categories.find(cat => cat.slug === 'clothing');
    const topsCategory = categories.find(cat => cat.slug === 'tops');
    const bottomsCategory = categories.find(cat => cat.slug === 'bottoms');
    const shoesCategory = categories.find(cat => cat.slug === 'shoes');
    
    if (!clothingCategory || !topsCategory || !bottomsCategory || !shoesCategory) {
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
      
      if (brandData.name === 'Lululemon') {
        products = [
          {
            name: 'Align High-Rise Pant',
            slug: createSlug('lululemon-align-high-rise-pant'),
            description: 'Ultra-soft yoga pant with buttery feel',
            price: 128,
            image: 'https://images.lululemon.com/is/image/lululemon/LW5CXYS_025755_1',
            brandId: brand.id,
            categoryId: bottomsCategory.id
          },
          {
            name: 'Everywhere Belt Bag',
            slug: createSlug('lululemon-everywhere-belt-bag'),
            description: 'Hands-free storage for all your essentials',
            price: 38,
            image: 'https://images.lululemon.com/is/image/lululemon/LW9CY2S_0001_1',
            brandId: brand.id,
            categoryId: clothingCategory.id
          },
          {
            name: 'Scuba Oversized Half-Zip',
            slug: createSlug('lululemon-scuba-oversized-half-zip'),
            description: 'Cozy hoodie perfect for post-workout comfort',
            price: 118,
            image: 'https://images.lululemon.com/is/image/lululemon/LW3EP8S_026083_1',
            brandId: brand.id,
            categoryId: topsCategory.id
          },
          {
            name: 'Wunder Train High-Rise Tight',
            slug: createSlug('lululemon-wunder-train-high-rise-tight'),
            description: 'Training tight with Everlux fabric',
            price: 98,
            image: 'https://images.lululemon.com/is/image/lululemon/LW5DWQS_0001_1',
            brandId: brand.id,
            categoryId: bottomsCategory.id
          }
        ];
      } else if (brandData.name === 'Buckle') {
        products = [
          {
            name: 'Miss Me Cuffed Skinny Stretch Jean',
            slug: createSlug('buckle-miss-me-cuffed-skinny-stretch-jean'),
            description: 'Premium denim with unique embellishments',
            price: 89,
            image: 'https://media.buckle.com/media/catalog/product/2/4/242M334L236_1.jpg',
            brandId: brand.id,
            categoryId: bottomsCategory.id
          },
          {
            name: 'Rock Revival Straight Stretch Jean',
            slug: createSlug('buckle-rock-revival-straight-stretch-jean'),
            description: 'Distinctive denim with signature styling',
            price: 179,
            image: 'https://media.buckle.com/media/catalog/product/2/4/242R127S215_1.jpg',
            brandId: brand.id,
            categoryId: bottomsCategory.id
          },
          {
            name: 'Daytrip Crossbody Bag',
            slug: createSlug('buckle-daytrip-crossbody-bag'),
            description: 'Trendy crossbody with adjustable strap',
            price: 45,
            image: 'https://media.buckle.com/media/catalog/product/2/4/242DT8012_1.jpg',
            brandId: brand.id,
            categoryId: clothingCategory.id
          },
          {
            name: 'BKE Boutique Graphic Tee',
            slug: createSlug('buckle-bke-boutique-graphic-tee'),
            description: 'Soft cotton tee with unique graphics',
            price: 29,
            image: 'https://media.buckle.com/media/catalog/product/2/4/242BKE045_1.jpg',
            brandId: brand.id,
            categoryId: topsCategory.id
          }
        ];
      } else if (brandData.name === 'American Eagle') {
        products = [
          {
            name: 'AE Ne(x)t Level High-Waisted Jegging',
            slug: createSlug('american-eagle-next-level-high-waisted-jegging'),
            description: 'Super stretch denim that moves with you',
            price: 49.95,
            image: 'https://www.ae.com/api/cp/contentserver/rendering/image/publicsites/aeo_product_detail/0433_9607_486_f.jpg',
            brandId: brand.id,
            categoryId: bottomsCategory.id
          },
          {
            name: 'AE Oversized Vintage Crew Sweatshirt',
            slug: createSlug('american-eagle-oversized-vintage-crew-sweatshirt'),
            description: 'Cozy vintage-inspired sweatshirt',
            price: 39.95,
            image: 'https://www.ae.com/api/cp/contentserver/rendering/image/publicsites/aeo_product_detail/1340_2507_073_f.jpg',
            brandId: brand.id,
            categoryId: topsCategory.id
          },
          {
            name: 'AE Canvas Mini Backpack',
            slug: createSlug('american-eagle-canvas-mini-backpack'),
            description: 'Compact backpack perfect for essentials',
            price: 29.95,
            image: 'https://www.ae.com/api/cp/contentserver/rendering/image/publicsites/aeo_product_detail/0511_5148_309_f.jpg',
            brandId: brand.id,
            categoryId: clothingCategory.id
          },
          {
            name: 'AE Highest Waist Mom Jean',
            slug: createSlug('american-eagle-highest-waist-mom-jean'),
            description: 'Relaxed vintage-inspired mom jeans',
            price: 59.95,
            image: 'https://www.ae.com/api/cp/contentserver/rendering/image/publicsites/aeo_product_detail/0432_4474_486_f.jpg',
            brandId: brand.id,
            categoryId: bottomsCategory.id
          }
        ];
      }

      // Create products for this brand
      for (const productData of products) {
        const product = await prisma.product.create({
          data: {
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
          }
        });
      }

      console.log(`  ✅ Added ${brandData.name} with ${products.length} products`);
    }

    console.log('✨ Successfully added new featured brands!');
    
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

addNewBrands();
