import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Build where clause for Prisma query
    const where: any = {}
    
    if (category && category !== 'all') {
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
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { name: { contains: search, mode: 'insensitive' } } },
        { category: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }

    // Get products with related data
    const [dbProducts, dbTotalCount] = await Promise.all([
      prisma!.product.findMany({
        where,
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1 // Get only the first/primary image
          },
          category: true,
          brand: true,
          _count: {
            select: {
              reviews: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma!.product.count({ where })
    ])

    // Transform products to match frontend expectations
    const products = dbProducts.map(product => {
      // Calculate average rating
      const avgRating = product.reviews.length > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 4.0 // Default rating for products without reviews

      return {
        id: product.id,
        title: product.name,
        brand: product.brand.name,
        price: product.price,
        originalPrice: product.originalPrice,
        rating: Number(avgRating.toFixed(1)),
        reviews: product._count.reviews,
        image: product.images[0]?.url || '/placeholder-image.jpg',
        retailer: product.brand.name,
        category: product.category.name,
        inStock: product.inStock,
        description: product.description,
        sizes: product.sizes ? product.sizes.split(',') : [],
        colors: product.colors ? product.colors.split(',') : [],
        productUrl: product.sourceUrl,
        slug: product.slug,
        platform: 'database' // Indicates this is from our database
      }
    })

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total: dbTotalCount,
        pages: Math.ceil(dbTotalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching products from database:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products from database',
        products: [] // Return empty array instead of falling back to mock data
      },
      { status: 500 }
    )
  }
}
