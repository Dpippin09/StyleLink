import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create categories
  const clothingCategory = await prisma.category.create({
    data: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'All types of clothing and apparel',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
    }
  })

  const shoesCategory = await prisma.category.create({
    data: {
      name: 'Shoes',
      slug: 'shoes',
      description: 'Footwear for all occasions',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
    }
  })

  const accessoriesCategory = await prisma.category.create({
    data: {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Fashion accessories and jewelry',
      image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400'
    }
  })

  // Create subcategories
  const dressesCategory = await prisma.category.create({
    data: {
      name: 'Dresses',
      slug: 'dresses',
      description: 'Beautiful dresses for every occasion',
      parentId: clothingCategory.id,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'
    }
  })

  const topsCategory = await prisma.category.create({
    data: {
      name: 'Tops',
      slug: 'tops',
      description: 'Stylish tops, blouses, and shirts',
      parentId: clothingCategory.id,
      image: 'https://images.unsplash.com/photo-1564257577-7fd4b61137c3?w=400'
    }
  })

  // Create brands
  const zaraBrand = await prisma.brand.create({
    data: {
      name: 'Zara',
      slug: 'zara',
      description: 'Fast fashion retailer offering trendy clothing',
      website: 'https://www.zara.com',
      logo: 'https://logoeps.com/wp-content/uploads/2013/02/zara-vector-logo.png'
    }
  })

  const hMBrand = await prisma.brand.create({
    data: {
      name: 'H&M',
      slug: 'h-and-m',
      description: 'Affordable fashion for everyone',
      website: 'https://www2.hm.com',
      logo: 'https://logos-world.net/wp-content/uploads/2020/12/HM-Logo.png'
    }
  })

  const nikeBrand = await prisma.brand.create({
    data: {
      name: 'Nike',
      slug: 'nike',
      description: 'Athletic wear and sports equipment',
      website: 'https://www.nike.com',
      logo: 'https://logoeps.com/wp-content/uploads/2013/02/nike-vector-logo.png'
    }
  })

  // Create products
  const products = [
    {
      name: 'Elegant Summer Dress',
      slug: 'elegant-summer-dress',
      description: 'A beautiful flowy summer dress perfect for any occasion. Made with lightweight, breathable fabric.',
      price: 79.99,
      originalPrice: 89.99,
      sizes: 'XS,S,M,L,XL',
      colors: 'Navy,Black,Pink,White',
      materials: 'Cotton,Polyester',
      categoryId: dressesCategory.id,
      brandId: zaraBrand.id,
      sourceUrl: 'https://www.zara.com/us/en/dress-p12345678.html',
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566479179817-c2e08b6b9cb3?w=600&auto=format&fit=crop'
      ]
    },
    {
      name: 'Classic White Button-Up Shirt',
      slug: 'classic-white-button-up-shirt',
      description: 'Timeless white button-up shirt that pairs with everything. Essential wardrobe piece.',
      price: 45.00,
      originalPrice: 55.00,
      sizes: 'XS,S,M,L,XL',
      colors: 'White,Light Blue,Pink',
      materials: 'Cotton',
      categoryId: topsCategory.id,
      brandId: hMBrand.id,
      sourceUrl: 'https://www2.hm.com/en_us/productpage.12345.html',
      images: [
        'https://images.unsplash.com/photo-1564257577-7fd4b61137c3?w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop'
      ]
    },
    {
      name: 'Cropped Denim Jacket',
      slug: 'cropped-denim-jacket',
      description: 'Trendy cropped denim jacket perfect for layering. Classic vintage-inspired design.',
      price: 89.99,
      sizes: 'XS,S,M,L',
      colors: 'Light Denim,Dark Denim,Black',
      materials: 'Cotton,Denim',
      categoryId: topsCategory.id,
      brandId: zaraBrand.id,
      sourceUrl: 'https://www.zara.com/us/en/jacket-p98765432.html',
      images: [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&auto=format&fit=crop'
      ]
    },
    {
      name: 'Running Sneakers',
      slug: 'nike-running-sneakers',
      description: 'Comfortable and stylish running sneakers with advanced cushioning technology.',
      price: 129.99,
      originalPrice: 149.99,
      sizes: '5,6,7,8,9,10,11',
      colors: 'White,Black,Pink,Gray',
      materials: 'Mesh,Rubber',
      categoryId: shoesCategory.id,
      brandId: nikeBrand.id,
      sourceUrl: 'https://www.nike.com/t/air-max-270-womens-shoes-xyz123',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop'
      ]
    },
    {
      name: 'Bohemian Maxi Dress',
      slug: 'bohemian-maxi-dress',
      description: 'Flowing bohemian maxi dress with beautiful floral print. Perfect for festivals or vacation.',
      price: 95.00,
      sizes: 'XS,S,M,L,XL',
      colors: 'Floral Print,Solid Navy,Solid Black',
      materials: 'Viscose,Rayon',
      categoryId: dressesCategory.id,
      brandId: hMBrand.id,
      sourceUrl: 'https://www2.hm.com/en_us/productpage.67890.html',
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop'
      ]
    },
    {
      name: 'Silk Scarf Collection',
      slug: 'silk-scarf-collection',
      description: 'Luxurious silk scarf with hand-painted design. Elevate any outfit with this elegant accessory.',
      price: 65.00,
      originalPrice: 80.00,
      colors: 'Floral,Geometric,Solid',
      materials: 'Silk',
      categoryId: accessoriesCategory.id,
      brandId: zaraBrand.id,
      sourceUrl: 'https://www.zara.com/us/en/scarf-p11223344.html',
      images: [
        'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&auto=format&fit=crop'
      ]
    }
  ]

  // Create products with images
  for (const productData of products) {
    const { images, ...productInfo } = productData
    
    const product = await prisma.product.create({
      data: productInfo
    })

    // Create product images
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          url: images[i],
          alt: `${product.name} - Image ${i + 1}`,
          isPrimary: i === 0,
          order: i,
          productId: product.id
        }
      })
    }
  }

  // Create a sample user
  const hashedPassword = await bcrypt.hash('demo123', 12)
  const sampleUser = await prisma.user.create({
    data: {
      email: 'demo@stylelink.com',
      name: 'Demo User',
      password: hashedPassword,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200'
    }
  })

  // Create user profile
  await prisma.profile.create({
    data: {
      userId: sampleUser.id,
      bio: 'Fashion enthusiast who loves mixing classic pieces with trendy accessories.',
      location: 'New York, NY',
      gender: 'female',
      styleTypes: 'minimalist,classic,trendy',
      sizePreference: 'M',
      colorPreferences: 'black,white,navy,pink',
      priceRange: 'mid-range'
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('📊 Created:')
  console.log('   - 6 categories (3 main + 2 subcategories)')
  console.log('   - 3 brands (Zara, H&M, Nike)')
  console.log('   - 6 products with images')
  console.log('   - 1 sample user with profile')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
