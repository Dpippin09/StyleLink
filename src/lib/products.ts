import { prisma } from '@/lib/db'

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  originalPrice: number | null
  currency: string
  inStock: boolean
  sizes: string | null
  colors: string | null
  materials: string | null
  sourceUrl: string | null
  affiliate: boolean
  createdAt: Date
  updatedAt: Date
  category: {
    id: string
    name: string
    slug: string
  }
  brand: {
    id: string
    name: string
    slug: string
  }
  images: Array<{
    id: string
    url: string
    alt: string | null
    isPrimary: boolean
    order: number
  }>
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
  error?: string
}

export async function getProducts(params?: {
  category?: string
  brand?: string
  search?: string
  page?: number
  limit?: number
}): Promise<ApiResponse<Product[]>> {
  try {
    const { category, brand, search, page = 1, limit = 12 } = params || {}
    const skip = (page - 1) * limit

    // Check if database is available
    if (!prisma) {
      return {
        success: false,
        data: [],
        error: 'Database not available'
      }
    }

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
    const [products, totalCount] = await Promise.all([
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

    return {
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      success: false,
      data: [],
      error: 'Failed to fetch products'
    }
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
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

    return {
      success: true,
      data: categories
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return {
      success: false,
      data: [],
      error: 'Failed to fetch categories'
    }
  }
}

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return {
      success: true,
      data: brands
    }
  } catch (error) {
    console.error('Error fetching brands:', error)
    return {
      success: false,
      data: [],
      error: 'Failed to fetch brands'
    }
  }
}

// Helper functions for parsing string fields
export function parseColors(colors: string | null): string[] {
  return colors ? colors.split(',').map(c => c.trim()) : []
}

export function parseSizes(sizes: string | null): string[] {
  return sizes ? sizes.split(',').map(s => s.trim()) : []
}

export function parseMaterials(materials: string | null): string[] {
  return materials ? materials.split(',').map(m => m.trim()) : []
}
