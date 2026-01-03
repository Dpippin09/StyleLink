const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.review.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()

  // Create categories
  console.log('📂 Creating categories...')
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Tops',
        slug: 'tops',
        description: 'Shirts, blouses, and tops for all occasions'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Bottoms',
        slug: 'bottoms',
        description: 'Pants, jeans, skirts, and shorts'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Dresses',
        slug: 'dresses',
        description: 'Casual and formal dresses'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Outerwear',
        slug: 'outerwear',
        description: 'Coats, jackets, and blazers'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Shoes',
        slug: 'shoes',
        description: 'Footwear for every style'
      }
    })
  ])

  // Create brands
  console.log('🏷️ Creating brands...')
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: 'Everlane',
        slug: 'everlane',
        description: 'Sustainable basics and modern essentials',
        website: 'https://everlane.com'
      }
    }),
    prisma.brand.create({
      data: {
        name: 'Zara',
        slug: 'zara',
        description: 'Latest fashion trends and contemporary styles',
        website: 'https://zara.com'
      }
    }),
    prisma.brand.create({
      data: {
        name: 'COS',
        slug: 'cos',
        description: 'Minimalist and modern fashion',
        website: 'https://cosstores.com'
      }
    }),
    prisma.brand.create({
      data: {
        name: 'Uniqlo',
        slug: 'uniqlo',
        description: 'Quality basics and innovative fabrics',
        website: 'https://uniqlo.com'
      }
    })
  ])

  // Find categories and brands for reference
  const topsCategory = categories.find(c => c.slug === 'tops')
  const bottomsCategory = categories.find(c => c.slug === 'bottoms')
  const dressesCategory = categories.find(c => c.slug === 'dresses')
  const outerwearCategory = categories.find(c => c.slug === 'outerwear')
  const shoesCategory = categories.find(c => c.slug === 'shoes')

  const everlane = brands.find(b => b.slug === 'everlane')
  const zara = brands.find(b => b.slug === 'zara')
  const cos = brands.find(b => b.slug === 'cos')
  const uniqlo = brands.find(b => b.slug === 'uniqlo')

  // Create products
  console.log('👕 Creating products...')
  const products = [
    // Tops
    {
      name: 'Organic Cotton Relaxed Shirt',
      slug: 'organic-cotton-relaxed-shirt',
      description: 'A versatile button-down shirt made from organic cotton with a relaxed, easy fit.',
      price: 68.00,
      originalPrice: 85.00,
      inStock: true,
      sizes: 'XS,S,M,L,XL',
      colors: 'White,Navy,Light Blue,Sage',
      materials: 'Organic Cotton',
      categoryId: topsCategory.id,
      brandId: everlane.id,
      sourceUrl: 'https://everlane.com/products/organic-cotton-relaxed-shirt',
      images: [
        {
          url: '/hero-fashion.jpg.png',
          alt: 'Organic Cotton Relaxed Shirt - White',
          isPrimary: true,
          order: 0
        }
      ]
    },
    {
      name: 'Cashmere Crew Neck Sweater',
      slug: 'cashmere-crew-neck-sweater',
      description: 'Luxuriously soft cashmere sweater with a classic crew neck design.',
      price: 99.90,
      originalPrice: 129.90,
      inStock: true,
      sizes: 'XS,S,M,L,XL',
      colors: 'Cream,Grey,Black,Navy',
      materials: 'Cashmere',
      categoryId: topsCategory.id,
      brandId: uniqlo.id,
      sourceUrl: 'https://uniqlo.com/us/en/products/cashmere-crew-neck',
      images: [
        {
          url: '/woman-cardigan.jpg.png',
          alt: 'Cashmere Crew Neck Sweater',
          isPrimary: true,
          order: 0
        }
      ]
    },
    // Bottoms
    {
      name: 'High-Waisted Organic Cotton Jeans',
      slug: 'high-waisted-organic-cotton-jeans',
      description: 'Sustainable denim with a perfect fit and timeless style.',
      price: 89.00,
      inStock: true,
      sizes: '24,25,26,27,28,29,30,31,32',
      colors: 'Dark Wash,Medium Wash,Black',
      materials: 'Organic Cotton,Elastane',
      categoryId: bottomsCategory.id,
      brandId: everlane.id,
      sourceUrl: 'https://everlane.com/products/high-waisted-jeans',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop',
          alt: 'High-Waisted Organic Cotton Jeans',
          isPrimary: true,
          order: 0
        }
      ]
    },
    // Dresses
    {
      name: 'Midi Wrap Dress',
      slug: 'midi-wrap-dress',
      description: 'Elegant wrap dress that flatters every figure with its timeless silhouette.',
      price: 79.99,
      originalPrice: 99.99,
      inStock: true,
      sizes: 'XS,S,M,L,XL',
      colors: 'Black,Navy,Burgundy,Floral Print',
      materials: 'Viscose,Elastane',
      categoryId: dressesCategory.id,
      brandId: zara.id,
      sourceUrl: 'https://zara.com/us/en/midi-wrap-dress',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop',
          alt: 'Midi Wrap Dress',
          isPrimary: true,
          order: 0
        }
      ]
    },
    // Outerwear
    {
      name: 'Wool Blend Cocoon Coat',
      slug: 'wool-blend-cocoon-coat',
      description: 'Minimalist cocoon coat in a premium wool blend for ultimate warmth and style.',
      price: 295.00,
      inStock: true,
      sizes: 'XS,S,M,L,XL',
      colors: 'Camel,Black,Navy,Grey',
      materials: 'Wool,Polyester',
      categoryId: outerwearCategory.id,
      brandId: cos.id,
      sourceUrl: 'https://cosstores.com/en_usd/women/coats/wool-blend-coat',
      images: [
        {
          url: '/man-beige-coat.jpg.png',
          alt: 'Wool Blend Cocoon Coat',
          isPrimary: true,
          order: 0
        }
      ]
    },
    // More products
    {
      name: 'Cotton T-Shirt',
      slug: 'cotton-t-shirt',
      description: 'Simple organic cotton t-shirt in classic fit.',
      price: 25.00,
      inStock: true,
      sizes: 'XS,S,M,L,XL,XXL',
      colors: 'White,Black,Navy,Grey',
      materials: 'Organic Cotton',
      categoryId: topsCategory.id,
      brandId: everlane.id,
      sourceUrl: 'https://everlane.com/products/cotton-tshirt',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop',
          alt: 'Cotton T-Shirt',
          isPrimary: true,
          order: 0
        }
      ]
    }
  ]

  const createdProducts = []
  for (const productData of products) {
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

    createdProducts.push(product)
  }

  // Get demo user and add some reviews
  console.log('⭐ Creating product reviews...')
  let demoUser = await prisma.user.findUnique({
    where: { email: 'demo@stylelink.com' }
  })

  if (demoUser) {
    // Add reviews to first few products
    const reviewsData = [
      {
        rating: 5,
        title: 'Perfect fit and quality!',
        comment: 'Love this shirt! The organic cotton feels amazing.',
        verified: true,
        helpful: 12
      },
      {
        rating: 4,
        title: 'Great value',
        comment: 'Really nice quality for the price.',
        verified: true,
        helpful: 8
      },
      {
        rating: 5,
        title: 'So comfortable',
        comment: 'These are incredibly comfortable.',
        verified: true,
        helpful: 15
      }
    ]

    for (let i = 0; i < Math.min(createdProducts.length, reviewsData.length); i++) {
      await prisma.review.create({
        data: {
          ...reviewsData[i],
          userId: demoUser.id,
          productId: createdProducts[i].id
        }
      })
    }
  }

  console.log('✅ Database seeded successfully!')
  console.log(`Created:`)
  console.log(`- ${categories.length} categories`)
  console.log(`- ${brands.length} brands`) 
  console.log(`- ${createdProducts.length} products`)
  console.log(`- Product images and reviews`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
