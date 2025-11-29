import { NextResponse } from 'next/server'

// Mock categories data for when database is not available
const mockCategories = [
  {
    id: '1',
    name: 'Clothing',
    slug: 'clothing',
    description: 'All types of clothing and apparel',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop',
    parentId: null,
    children: [
      {
        id: '4',
        name: 'Dresses',
        slug: 'dresses',
        description: 'Beautiful dresses for every occasion',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop',
        parentId: '1'
      },
      {
        id: '5',
        name: 'Tops',
        slug: 'tops',
        description: 'Stylish tops, blouses, and shirts',
        image: 'https://images.unsplash.com/photo-1564257577-7fd4b61137c3?w=400&auto=format&fit=crop',
        parentId: '1'
      }
    ],
    _count: { products: 3 }
  },
  {
    id: '2',
    name: 'Shoes',
    slug: 'shoes',
    description: 'Footwear for all occasions',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop',
    parentId: null,
    children: [],
    _count: { products: 1 }
  },
  {
    id: '3',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Fashion accessories and jewelry',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&auto=format&fit=crop',
    parentId: null,
    children: [],
    _count: { products: 1 }
  }
]

export async function GET() {
  try {
    // Try to use database if available, otherwise use mock data
    let categories: any = mockCategories
    
    try {
      let prisma = null
      try {
        const dbModule = await import('@/lib/db')
        prisma = dbModule.prisma
      } catch (importError) {
        console.log('Database module not available, using mock data')
      }
      
      if (prisma) {
        categories = await prisma.category.findMany({
          include: {
            children: true,
            _count: {
              select: {
                products: true
              }
            }
          },
          orderBy: { name: 'asc' }
        })
      }
    } catch (dbError) {
      console.log('Database not available, using mock data')
    }

    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
