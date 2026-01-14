import { PrismaClient } from '@prisma/client'
import { searchMultiplePlatforms } from './search-aggregator'
import type { ExternalProduct } from './external-search'

const prisma = new PrismaClient()

export interface ImportConfig {
  categories: string[]
  productsPerCategory: number
  platforms: string[]
  updateExisting: boolean
}

export interface ImportStats {
  totalSearched: number
  totalImported: number
  totalUpdated: number
  totalSkipped: number
  errors: string[]
  duration: number
}

export class ProductImportService {
  
  // Import products from external APIs into database
  async importProducts(config: ImportConfig): Promise<ImportStats> {
    const startTime = Date.now()
    const stats: ImportStats = {
      totalSearched: 0,
      totalImported: 0,
      totalUpdated: 0,
      totalSkipped: 0,
      errors: [],
      duration: 0
    }

    console.log('🔄 Starting product import process...')
    console.log('Config:', config)

    try {
      // Ensure categories exist in database first
      await this.ensureCategories(config.categories)
      
      for (const category of config.categories) {
        console.log(`📦 Importing products for category: ${category}`)
        
        try {
          // Search for products in this category across all platforms
          const searchResult = await searchMultiplePlatforms(category, {
            platforms: config.platforms as any,
            maxResultsPerPlatform: config.productsPerCategory,
            category
          })

          if (searchResult.success && searchResult.products.length > 0) {
            stats.totalSearched += searchResult.products.length
            
            // Process each product
            for (const product of searchResult.products) {
              try {
                const result = await this.importSingleProduct(product, category, config.updateExisting)
                
                if (result === 'imported') stats.totalImported++
                else if (result === 'updated') stats.totalUpdated++
                else if (result === 'skipped') stats.totalSkipped++
                
              } catch (error) {
                const errorMsg = `Failed to import product ${product.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
                console.error(errorMsg)
                stats.errors.push(errorMsg)
              }
            }
          } else {
            console.log(`⚠️ No products found for category: ${category}`)
          }
          
          // Small delay between categories to be respectful to APIs
          await new Promise(resolve => setTimeout(resolve, 1000))
          
        } catch (error) {
          const errorMsg = `Failed to search category ${category}: ${error instanceof Error ? error.message : 'Unknown error'}`
          console.error(errorMsg)
          stats.errors.push(errorMsg)
        }
      }

    } catch (error) {
      const errorMsg = `Import process failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      console.error(errorMsg)
      stats.errors.push(errorMsg)
    }

    stats.duration = Date.now() - startTime
    
    console.log('✅ Product import completed!')
    console.log('📊 Import Statistics:', stats)
    
    return stats
  }

  // Import a single product into the database
  private async importSingleProduct(
    externalProduct: ExternalProduct, 
    categoryName: string, 
    updateExisting: boolean
  ): Promise<'imported' | 'updated' | 'skipped'> {
    
    // Check if product already exists (by external ID and platform)
    const existingProduct = await prisma.product.findFirst({
      where: {
        externalId: externalProduct.id,
        externalPlatform: externalProduct.platform
      }
    })

    if (existingProduct && !updateExisting) {
      return 'skipped'
    }

    // Generate slug helper
    const generateSlug = (name: string): string => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    // Get or create category
    const category = await prisma.category.upsert({
      where: { slug: generateSlug(categoryName) },
      update: {},
      create: { 
        name: categoryName,
        slug: generateSlug(categoryName)
      }
    })

    // Get or create brand
    const brandName = externalProduct.brand || 'Unknown'
    const brand = await prisma.brand.upsert({
      where: { slug: generateSlug(brandName) },
      update: {},
      create: { 
        name: brandName,
        slug: generateSlug(brandName)
      }
    })

    // Prepare product data
    const productSlug = generateSlug(`${externalProduct.title}-${externalProduct.id}`)
    const productData = {
      name: externalProduct.title,
      slug: productSlug,
      description: externalProduct.description || externalProduct.title,
      price: externalProduct.price,
      originalPrice: externalProduct.originalPrice,
      currency: externalProduct.currency || 'USD',
      inStock: true,
      categoryId: category.id,
      brandId: brand.id,
      sourceUrl: externalProduct.productUrl,
      affiliate: true,
      externalId: externalProduct.id,
      externalPlatform: externalProduct.platform,
      lastSyncedAt: new Date()
    }

    if (existingProduct && updateExisting) {
      // Update existing product
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: productData
      })

      // Update main image if available
      if (externalProduct.imageUrl) {
        await prisma.productImage.upsert({
          where: {
            id: await this.getOrCreatePrimaryImageId(existingProduct.id)
          },
          update: {
            url: externalProduct.imageUrl,
            alt: externalProduct.title
          },
          create: {
            productId: existingProduct.id,
            url: externalProduct.imageUrl,
            alt: externalProduct.title,
            order: 0,
            isPrimary: true
          }
        })
      }

      return 'updated'
    } else {
      // Create new product
      const newProduct = await prisma.product.create({
        data: productData
      })

      // Add main image if available
      if (externalProduct.imageUrl) {
        await prisma.productImage.create({
          data: {
            productId: newProduct.id,
            url: externalProduct.imageUrl,
            alt: externalProduct.title,
            order: 0,
            isPrimary: true
          }
        })
      }

      return 'imported'
    }
  }

  // Helper to get or create primary image ID
  private async getOrCreatePrimaryImageId(productId: string): Promise<string> {
    const primaryImage = await prisma.productImage.findFirst({
      where: {
        productId,
        isPrimary: true
      }
    })

    if (primaryImage) {
      return primaryImage.id
    }

    // Create a primary image record
    const newImage = await prisma.productImage.create({
      data: {
        productId,
        url: '',
        order: 0,
        isPrimary: true
      }
    })

    return newImage.id
  }

  // Ensure categories exist in the database
  private async ensureCategories(categories: string[]): Promise<void> {
    for (const categoryName of categories) {
      const generateSlug = (name: string): string => {
        return name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }

      await prisma.category.upsert({
        where: { slug: generateSlug(categoryName) },
        update: {},
        create: { 
          name: categoryName,
          slug: generateSlug(categoryName)
        }
      })
    }
  }

  // Clean up old products that haven't been synced recently
  // Note: This method will work after Prisma schema is updated and regenerated
  async cleanupOldProducts(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    // For now, just return 0 until schema is updated
    console.log(`🧹 Cleanup not yet available - need to regenerate Prisma client after schema update`)
    return 0

    // This will work after schema update:
    // const result = await prisma.product.deleteMany({
    //   where: {
    //     lastSyncedAt: {
    //       lt: cutoffDate
    //     },
    //     // Only delete external products, not manually added ones
    //     externalId: {
    //       not: null
    //     }
    //   }
    // })
    // console.log(`🧹 Cleaned up ${result.count} old products`)
    // return result.count
  }

  // Get import statistics
  // Note: This method will work after Prisma schema is updated and regenerated
  async getImportStats(): Promise<{
    totalProducts: number
    byPlatform: Record<string, number>
    lastSyncTime: Date | null
  }> {
    const totalProducts = await prisma.product.count()

    // For now, return basic stats until schema is updated
    console.log(`📊 Found ${totalProducts} total products in database`)
    
    return {
      totalProducts,
      byPlatform: {},
      lastSyncTime: null
    }

    // This will work after schema update:
    // const totalProducts = await prisma.product.count({
    //   where: {
    //     externalId: { not: null }
    //   }
    // })

    // const platformStats = await prisma.product.groupBy({
    //   by: ['externalPlatform'],
    //   where: {
    //     externalId: { not: null }
    //   },
    //   _count: true
    // })

    // const byPlatform: Record<string, number> = {}
    // platformStats.forEach(stat => {
    //   if (stat.externalPlatform) {
    //     byPlatform[stat.externalPlatform] = stat._count
    //   }
    // })

    // const lastSync = await prisma.product.findFirst({
    //   where: {
    //     externalId: { not: null }
    //   },
    //   orderBy: {
    //     lastSyncedAt: 'desc'
    //   }
    // })

    // return {
    //   totalProducts,
    //   byPlatform,
    //   lastSyncTime: lastSync?.lastSyncedAt || null
    // }
  }
}

export const productImportService = new ProductImportService()
