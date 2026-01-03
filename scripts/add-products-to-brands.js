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

async function addProductsToExistingBrands() {
  try {
    console.log('🌱 Adding products to existing brands...');

    // Get existing categories
    const categories = await prisma.category.findMany();
    const clothingCategory = categories.find(cat => cat.slug === 'clothing');
    const topsCategory = categories.find(cat => cat.slug === 'tops');
    const bottomsCategory = categories.find(cat => cat.slug === 'bottoms');
    
    if (!clothingCategory || !topsCategory || !bottomsCategory) {
      throw new Error('Required categories not found');
    }

    // Get the brands that need products
    const lululemonBrand = await prisma.brand.findFirst({ where: { name: 'Lululemon' } });
    const buckleBrand = await prisma.brand.findFirst({ where: { name: 'Buckle' } });

    if (lululemonBrand) {
      console.log('Adding products for Lululemon...');
      const lululemonProducts = [
        {
          name: 'Align High-Rise Pant',
          slug: createSlug('lululemon-align-high-rise-pant'),
          description: 'Ultra-soft yoga pant with buttery feel',
          price: 128,
          image: 'https://images.lululemon.com/is/image/lululemon/LW5CXYS_025755_1',
          brandId: lululemonBrand.id,
          categoryId: bottomsCategory.id
        },
        {
          name: 'Everywhere Belt Bag',
          slug: createSlug('lululemon-everywhere-belt-bag'),
          description: 'Hands-free storage for all your essentials',
          price: 38,
          image: 'https://images.lululemon.com/is/image/lululemon/LW9CY2S_0001_1',
          brandId: lululemonBrand.id,
          categoryId: clothingCategory.id
        },
        {
          name: 'Scuba Oversized Half-Zip',
          slug: createSlug('lululemon-scuba-oversized-half-zip'),
          description: 'Cozy hoodie perfect for post-workout comfort',
          price: 118,
          image: 'https://images.lululemon.com/is/image/lululemon/LW3EP8S_026083_1',
          brandId: lululemonBrand.id,
          categoryId: topsCategory.id
        },
        {
          name: 'Wunder Train High-Rise Tight',
          slug: createSlug('lululemon-wunder-train-high-rise-tight'),
          description: 'Training tight with Everlux fabric',
          price: 98,
          image: 'https://images.lululemon.com/is/image/lululemon/LW5DWQS_0001_1',
          brandId: lululemonBrand.id,
          categoryId: bottomsCategory.id
        }
      ];

      for (const productData of lululemonProducts) {
        await prisma.product.create({
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
      console.log(`  ✅ Added ${lululemonProducts.length} products for Lululemon`);
    }

    if (buckleBrand) {
      console.log('Adding products for Buckle...');
      const buckleProducts = [
        {
          name: 'Miss Me Cuffed Skinny Stretch Jean',
          slug: createSlug('buckle-miss-me-cuffed-skinny-stretch-jean'),
          description: 'Premium denim with unique embellishments',
          price: 89,
          image: 'https://media.buckle.com/media/catalog/product/2/4/242M334L236_1.jpg',
          brandId: buckleBrand.id,
          categoryId: bottomsCategory.id
        },
        {
          name: 'Rock Revival Straight Stretch Jean',
          slug: createSlug('buckle-rock-revival-straight-stretch-jean'),
          description: 'Distinctive denim with signature styling',
          price: 179,
          image: 'https://media.buckle.com/media/catalog/product/2/4/242R127S215_1.jpg',
          brandId: buckleBrand.id,
          categoryId: bottomsCategory.id
        },
        {
          name: 'Daytrip Crossbody Bag',
          slug: createSlug('buckle-daytrip-crossbody-bag'),
          description: 'Trendy crossbody with adjustable strap',
          price: 45,
          image: 'https://media.buckle.com/media/catalog/product/2/4/242DT8012_1.jpg',
          brandId: buckleBrand.id,
          categoryId: clothingCategory.id
        },
        {
          name: 'BKE Boutique Graphic Tee',
          slug: createSlug('buckle-bke-boutique-graphic-tee'),
          description: 'Soft cotton tee with unique graphics',
          price: 29,
          image: 'https://media.buckle.com/media/catalog/product/2/4/242BKE045_1.jpg',
          brandId: buckleBrand.id,
          categoryId: topsCategory.id
        }
      ];

      for (const productData of buckleProducts) {
        await prisma.product.create({
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
      console.log(`  ✅ Added ${buckleProducts.length} products for Buckle`);
    }

    console.log('✨ Successfully added products to existing brands!');
    
    // Display summary
    const totalBrands = await prisma.brand.count();
    const totalProducts = await prisma.product.count();
    
    console.log(`\n📊 Database Summary:`);
    console.log(`   Total Brands: ${totalBrands}`);
    console.log(`   Total Products: ${totalProducts}`);

  } catch (error) {
    console.error('❌ Error adding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addProductsToExistingBrands();
