import { NextResponse } from 'next/server'

// Mock brands data for when database is not available
const mockBrands = [
  {
    id: '1',
    name: 'Zara',
    slug: 'zara',
    description: 'Fast fashion retailer offering trendy clothing',
    logo: null,
    website: 'https://www.zara.com',
    _count: { products: 2 }
  },
  {
    id: '2',
    name: 'H&M',
    slug: 'h-and-m',
    description: 'Affordable fashion for everyone',
    logo: null,
    website: 'https://www2.hm.com',
    _count: { products: 2 }
  },
  {
    id: '3',
    name: 'Nike',
    slug: 'nike',
    description: 'Athletic wear and sports equipment',
    logo: null,
    website: 'https://www.nike.com',
    _count: { products: 1 }
  }
]

export async function GET() {
  try {
    // Try to use database if available, otherwise use mock data
    let brands: any = mockBrands
    
    try {
      const { prisma } = await import('@/lib/db')
      if (prisma) {
        brands = await prisma.brand.findMany({
          include: {
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
      data: brands
    })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}
