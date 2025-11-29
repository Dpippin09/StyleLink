import { NextRequest, NextResponse } from 'next/server'

// Mock products data for when database is not available
const mockProducts = [
  {
    id: '1',
    name: 'Elegant Summer Dress',
    slug: 'elegant-summer-dress',
    description: 'A beautiful flowy summer dress perfect for any occasion.',
    price: 79.99,
    originalPrice: 89.99,
    currency: 'USD',
    inStock: true,
    sizes: 'XS,S,M,L,XL',
    colors: 'Navy,Black,Pink,White',
    materials: 'Cotton,Polyester',
    sourceUrl: 'https://www.zara.com/us/en/dress-p12345678.html',
    affiliate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: '1', name: 'Dresses', slug: 'dresses' },
    brand: { id: '1', name: 'Zara', slug: 'zara' },
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop',
        alt: 'Elegant Summer Dress - Image 1',
        isPrimary: true,
        order: 0
      }
    ]
  },
  {
    id: '2',
    name: 'Classic White Button-Up Shirt',
    slug: 'classic-white-button-up-shirt',
    description: 'Timeless white button-up shirt that pairs with everything.',
    price: 45.00,
    originalPrice: 55.00,
    currency: 'USD',
    inStock: true,
    sizes: 'XS,S,M,L,XL',
    colors: 'White,Light Blue,Pink',
    materials: 'Cotton',
    sourceUrl: 'https://www2.hm.com/en_us/productpage.12345.html',
    affiliate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: '2', name: 'Tops', slug: 'tops' },
    brand: { id: '2', name: 'H&M', slug: 'h-and-m' },
    images: [
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1564257577-7fd4b61137c3?w=600&auto=format&fit=crop',
        alt: 'Classic White Button-Up Shirt - Image 1',
        isPrimary: true,
        order: 0
      }
    ]
  },
  {
    id: '3',
    name: 'Running Sneakers',
    slug: 'nike-running-sneakers',
    description: 'Comfortable and stylish running sneakers with advanced cushioning technology.',
    price: 129.99,
    originalPrice: 149.99,
    currency: 'USD',
    inStock: true,
    sizes: '5,6,7,8,9,10,11',
    colors: 'White,Black,Pink,Gray',
    materials: 'Mesh,Rubber',
    sourceUrl: 'https://www.nike.com/t/air-max-270-womens-shoes-xyz123',
    affiliate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: '3', name: 'Shoes', slug: 'shoes' },
    brand: { id: '3', name: 'Nike', slug: 'nike' },
    images: [
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop',
        alt: 'Running Sneakers - Image 1',
        isPrimary: true,
        order: 0
      }
    ]
  }
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    let products: any = mockProducts
    let totalCount = mockProducts.length

    try {
      // Try to use database if available
      let prisma = null
      try {
        const dbModule = await import('@/lib/db')
        prisma = dbModule.prisma
      } catch (importError) {
        console.log('Database module not available, using mock data')
      }
      
      if (prisma) {
        // Build where clause
        const where: any = {}
        
        if (category) {
          where.category = {
            slug: category
          }
        }
        
        if (brand) {
          where.brand = {
            slug: brand
          }
        }
        
        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        }

        // Get products with related data
        const [dbProducts, dbTotalCount] = await Promise.all([
          prisma.product.findMany({
            where,
            include: {
              images: {
                orderBy: { order: 'asc' }
              },
              category: true,
              brand: true
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.product.count({ where })
        ])

        products = dbProducts
        totalCount = dbTotalCount
      }
    } catch (dbError) {
      console.log('Database not available, using mock data')
      // Filter mock data based on search params
      let filteredProducts = [...mockProducts]
      
      if (search) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
        )
      }
      
      if (category) {
        filteredProducts = filteredProducts.filter(p => p.category.slug === category)
      }
      
      if (brand) {
        filteredProducts = filteredProducts.filter(p => p.brand.slug === brand)
      }

      products = filteredProducts.slice(skip, skip + limit)
      totalCount = filteredProducts.length
    }

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
