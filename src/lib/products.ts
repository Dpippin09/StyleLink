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

    // Mock data fallback
    const mockProducts: Product[] = [
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

    try {
      // Try database first
      const { prisma } = await import('@/lib/db')

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
      }
    } catch (dbError) {
      console.log('Database not available, using mock data')
    }
    
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

    const paginatedProducts = filteredProducts.slice(skip, skip + limit)
    
    return {
      success: true,
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / limit)
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
    if (prisma) {
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
    }
    
    return {
      success: false,
      data: [],
      error: 'Database not available'
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
    if (prisma) {
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
    }
    
    return {
      success: false,
      data: [],
      error: 'Database not available'
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
