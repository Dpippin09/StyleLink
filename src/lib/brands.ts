import { prisma } from './db'

export interface Brand {
  id: string
  name: string
  slug: string
  description: string
  website?: string
  productCount: number
  priceRange: {
    min: number
    max: number
  }
}

export async function getFeaturedBrands(limit: number = 8): Promise<{ success: boolean; data: Brand[] }> {
  try {
    const brands = await prisma!.brand.findMany({
      include: {
        products: {
          select: {
            price: true
          }
        }
      },
      take: limit,
      orderBy: {
        name: 'asc'
      }
    })

    const formattedBrands: Brand[] = brands
      .filter(brand => brand.products.length > 0) // Only include brands with products
      .map(brand => {
        const prices = brand.products.map(p => p.price)
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)

        return {
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          description: brand.description || `Discover the latest collection from ${brand.name}`,
          website: brand.website || undefined,
          productCount: brand.products.length,
          priceRange: {
            min: Math.floor(minPrice),
            max: Math.ceil(maxPrice)
          }
        }
      })

    return { success: true, data: formattedBrands }
  } catch (error) {
    console.error('Error fetching brands:', error)
    return { success: false, data: [] }
  }
}

export async function getAllBrands(): Promise<{ success: boolean; data: Brand[] }> {
  try {
    const brands = await prisma!.brand.findMany({
      include: {
        products: {
          select: {
            price: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    const formattedBrands: Brand[] = brands
      .filter(brand => brand.products.length > 0) // Only include brands with products
      .map(brand => {
        const prices = brand.products.map(p => p.price)
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)

        return {
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          description: brand.description || `Discover the latest collection from ${brand.name}`,
          website: brand.website || undefined,
          productCount: brand.products.length,
          priceRange: {
            min: Math.floor(minPrice),
            max: Math.ceil(maxPrice)
          }
        }
      })

    return { success: true, data: formattedBrands }
  } catch (error) {
    console.error('Error fetching brands:', error)
    return { success: false, data: [] }
  }
}
