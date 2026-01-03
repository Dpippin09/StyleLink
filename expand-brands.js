const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addMoreBrandsAndProducts() {
  console.log('🏷️ Adding more clothing manufacturers...')

  // Add new brands
  const newBrands = await Promise.all([
    prisma.brand.create({
      data: {
        name: 'H&M',
        slug: 'h-and-m',
        description: 'Fashion and quality at the best price in a more sustainable way',
        website: 'https://hm.com'
      }
    }),
    prisma.brand.create({
      data: {
        name: 'Nike',
        slug: 'nike',
        description: 'Just Do It - Athletic wear and sportswear',
        website: 'https://nike.com'
      }
    }),
    prisma.brand.create({
      data: {
        name: 'Adidas',
        slug: 'adidas',
        description: 'Impossible is Nothing - Sports and lifestyle brand',
        website: 'https://adidas.com'
      }
    }),
    prisma.brand.create({
      data: {
        name: 'Levi\'s',
        slug: 'levis',
        description: 'The original jeans company since 1853',
        website: 'https://levi.com'
      }
    }),
    prisma.brand.create({
      data: {
        name: 'Mango',
        slug: 'mango',
        description: 'Mediterranean style and contemporary fashion',
        website: 'https://shop.mango.com'
      }
    }),
    prisma.brand.create({
      data: {
        name: 'Gap',
        slug: 'gap',
        description: 'Casual wear and everyday essentials',
        website: 'https://gap.com'
      }
    }),
    prisma.brand.create({
      data: {
        name: 'ASOS',
        slug: 'asos',
        description: 'Online fashion for the 20-something crowd',
        website: 'https://asos.com'
      }
    }),
    prisma.brand.create({
      data: {
        name: 'Massimo Dutti',
        slug: 'massimo-dutti',
        description: 'Urban, sophisticated and contemporary style',
        website: 'https://massimodutti.com'
      }
    })
  ])

  console.log(`✅ Added ${newBrands.length} new brands`)

  // Get existing categories
  const categories = await prisma.category.findMany()
  const topsCategory = categories.find(c => c.slug === 'tops')
  const bottomsCategory = categories.find(c => c.slug === 'bottoms')
  const shoesCategory = categories.find(c => c.slug === 'shoes')
  const dressesCategory = categories.find(c => c.slug === 'dresses')
  const outerwearCategory = categories.find(c => c.slug === 'outerwear')

  // Find the new brands
  const hm = newBrands.find(b => b.slug === 'h-and-m')
  const nike = newBrands.find(b => b.slug === 'nike')
  const adidas = newBrands.find(b => b.slug === 'adidas')
  const levis = newBrands.find(b => b.slug === 'levis')
  const mango = newBrands.find(b => b.slug === 'mango')
  const gap = newBrands.find(b => b.slug === 'gap')
  const asos = newBrands.find(b => b.slug === 'asos')
  const massimoDutti = newBrands.find(b => b.slug === 'massimo-dutti')

  // Add products for these brands
  console.log('👕 Adding new products...')
  
  const newProducts = [
    // H&M Products
    {
      name: 'Ribbed Cotton T-shirt',
      slug: 'hm-ribbed-cotton-tshirt',
      description: 'Short-sleeved T-shirt in soft ribbed cotton jersey with a round neckline.',
      price: 12.99,
      originalPrice: 19.99,
      inStock: true,
      sizes: 'XS,S,M,L,XL',
      colors: 'White,Black,Navy,Pink',
      materials: 'Cotton',
      categoryId: topsCategory.id,
      brandId: hm.id,
      sourceUrl: 'https://hm.com/us/en/productpage.ribbed-cotton-tshirt.html',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop',
          alt: 'Ribbed Cotton T-shirt',
          isPrimary: true,
          order: 0
        }
      ]
    },
    // Nike Products
    {
      name: 'Air Force 1 \'07',
      slug: 'nike-air-force-1-07',
      description: 'The radiance lives on in the Nike Air Force 1 \'07, the basketball original.',
      price: 110.00,
      inStock: true,
      sizes: '6,7,8,9,10,11,12',
      colors: 'White,Black,Navy',
      materials: 'Leather,Rubber',
      categoryId: shoesCategory.id,
      brandId: nike.id,
      sourceUrl: 'https://nike.com/t/air-force-1-07-mens-shoes',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop',
          alt: 'Nike Air Force 1',
          isPrimary: true,
          order: 0
        }
      ]
    },
    // Adidas Products
    {
      name: 'Stan Smith Sneakers',
      slug: 'adidas-stan-smith-sneakers',
      description: 'Clean and simple, the Stan Smith is a timeless tennis shoe.',
      price: 85.00,
      originalPrice: 100.00,
      inStock: true,
      sizes: '6,7,8,9,10,11,12',
      colors: 'White,Green',
      materials: 'Leather,Rubber',
      categoryId: shoesCategory.id,
      brandId: adidas.id,
      sourceUrl: 'https://adidas.com/us/stan-smith-shoes',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop',
          alt: 'Adidas Stan Smith',
          isPrimary: true,
          order: 0
        }
      ]
    },
    // Levi's Products
    {
      name: '501® Original Jeans',
      slug: 'levis-501-original-jeans',
      description: 'The original blue jean. A blank canvas for self-expression.',
      price: 89.50,
      originalPrice: 98.00,
      inStock: true,
      sizes: '28,29,30,31,32,33,34,36',
      colors: 'Stonewash,Dark Blue,Black',
      materials: 'Cotton,Elastane',
      categoryId: bottomsCategory.id,
      brandId: levis.id,
      sourceUrl: 'https://levi.com/US/en_US/apparel/clothing/bottoms/501-original-jeans',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop',
          alt: 'Levi\'s 501 Jeans',
          isPrimary: true,
          order: 0
        }
      ]
    },
    // Mango Products
    {
      name: 'Flowy Midi Dress',
      slug: 'mango-flowy-midi-dress',
      description: 'Midi dress with a flowy silhouette and feminine details.',
      price: 69.99,
      originalPrice: 89.99,
      inStock: true,
      sizes: 'XS,S,M,L,XL',
      colors: 'Black,Navy,Burgundy,Floral',
      materials: 'Viscose,Polyester',
      categoryId: dressesCategory.id,
      brandId: mango.id,
      sourceUrl: 'https://shop.mango.com/us/women/dresses-midi/flowy-midi-dress',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop',
          alt: 'Flowy Midi Dress',
          isPrimary: true,
          order: 0
        }
      ]
    },
    // Gap Products
    {
      name: 'Vintage Khakis',
      slug: 'gap-vintage-khakis',
      description: 'Classic khaki chinos with a comfortable relaxed fit.',
      price: 59.95,
      originalPrice: 69.95,
      inStock: true,
      sizes: '28,29,30,31,32,33,34,36',
      colors: 'Khaki,Navy,Black,Olive',
      materials: 'Cotton,Elastane',
      categoryId: bottomsCategory.id,
      brandId: gap.id,
      sourceUrl: 'https://gap.com/browse/product.do?pid=vintage-khakis',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop',
          alt: 'Gap Vintage Khakis',
          isPrimary: true,
          order: 0
        }
      ]
    },
    // ASOS Products
    {
      name: 'Oversized Blazer',
      slug: 'asos-oversized-blazer',
      description: 'Contemporary oversized blazer perfect for layering.',
      price: 89.00,
      originalPrice: 120.00,
      inStock: true,
      sizes: 'XS,S,M,L,XL',
      colors: 'Black,Navy,Camel,Check',
      materials: 'Polyester,Viscose',
      categoryId: outerwearCategory.id,
      brandId: asos.id,
      sourceUrl: 'https://asos.com/us/asos/oversized-blazer',
      images: [
        {
          url: '/hero-fashion.jpg.png',
          alt: 'ASOS Oversized Blazer',
          isPrimary: true,
          order: 0
        }
      ]
    },
    // Massimo Dutti Products
    {
      name: 'Wool Blend Coat',
      slug: 'massimo-dutti-wool-blend-coat',
      description: 'Elegant wool blend coat with sophisticated tailoring.',
      price: 249.00,
      originalPrice: 299.00,
      inStock: true,
      sizes: 'XS,S,M,L,XL',
      colors: 'Camel,Black,Navy,Grey',
      materials: 'Wool,Polyester',
      categoryId: outerwearCategory.id,
      brandId: massimoDutti.id,
      sourceUrl: 'https://massimodutti.com/us/women/coats-wool-blend-coat',
      images: [
        {
          url: '/man-beige-coat.jpg.png',
          alt: 'Massimo Dutti Wool Coat',
          isPrimary: true,
          order: 0
        }
      ]
    }
  ]

  // Create products with images
  let productCount = 0
  for (const productData of newProducts) {
    const { images, ...productInfo } = productData
    const product = await prisma.product.create({
      data: productInfo
    })

    // Create product images
    for (const imageData of images) {
      await prisma.productImage.create({
        data: {
          ...imageData,
          productId: product.id
        }
      })
    }
    productCount++
  }

  console.log(`✅ Added ${productCount} new products`)
  console.log('🎉 Database updated with more clothing manufacturers!')
}

addMoreBrandsAndProducts()
  .catch((e) => {
    console.error('❌ Error adding brands and products:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
