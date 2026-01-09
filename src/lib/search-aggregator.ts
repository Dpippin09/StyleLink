import { searchEbay } from './ebay-search'
import { searchWalmart } from './walmart-search'
import { searchAmazon } from './amazon-search'
// import { searchGoogle } from './google-search' // Temporarily disabled due to build issues
import { searchEtsy } from './etsy-search'
import { MultiPlatformSearchResponse, ExternalProduct } from './external-search'

export interface SearchOptions {
  platforms?: ('ebay' | 'walmart' | 'amazon' | 'google' | 'etsy')[]
  category?: string
  maxResultsPerPlatform?: number
  sortBy?: 'price' | 'relevance' | 'rating'
  priceRange?: {
    min: number
    max: number
  }
}

// Main function to search across multiple platforms
export async function searchMultiplePlatforms(
  query: string,
  options: SearchOptions = {}
): Promise<MultiPlatformSearchResponse> {
  const startTime = Date.now()
  
  const {
    platforms = ['ebay'], // Focus on eBay only for now
    category,
    maxResultsPerPlatform = 10,
    sortBy = 'price',
    priceRange
  } = options

  try {
    // Create search promises for each enabled platform
    const searchPromises = platforms.map(async (platform) => {
      try {
        switch (platform) {
          case 'ebay':
            return await searchEbay(query, category, maxResultsPerPlatform)
          case 'walmart':
            return await searchWalmart(query, category, maxResultsPerPlatform)
          case 'amazon':
            return await searchAmazon(query, category, maxResultsPerPlatform)
          case 'google':
            // Temporarily disabled - return empty result
            return {
              success: false,
              platform: 'google',
              products: [],
              error: 'Google search temporarily disabled',
              searchTime: 0,
              totalResults: 0
            }
          case 'etsy':
            return await searchEtsy(query, category, maxResultsPerPlatform)
          default:
            throw new Error(`Unknown platform: ${platform}`)
        }
      } catch (error) {
        console.error(`Error searching ${platform}:`, error)
        return {
          success: false,
          platform,
          products: [],
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })

    // Execute all searches in parallel
    const searchResults = await Promise.all(searchPromises)
    
    // Collect all products from successful searches
    let allProducts: ExternalProduct[] = []
    const platformResults: Record<string, any> = {}
    
    for (const result of searchResults) {
      const platformKey = result.platform.toLowerCase()
      console.log(`Search aggregator - Platform: ${result.platform} -> Key: ${platformKey}`)
      console.log(`Search aggregator - Result:`, { success: result.success, products: result.products?.length || 0 })
      
      platformResults[platformKey] = result
      if (result.success && result.products) {
        allProducts = allProducts.concat(result.products)
      }
    }

    // Filter by price range if specified
    if (priceRange) {
      allProducts = allProducts.filter(product => 
        product.price >= priceRange.min && product.price <= priceRange.max
      )
    }

    // Sort products based on criteria
    allProducts = sortProducts(allProducts, sortBy)

    // Calculate aggregated stats
    const totalResults = searchResults.reduce((sum, result) => 
      sum + (result.totalResults || 0), 0
    )

    const averageSearchTime = searchResults
      .filter(r => r.searchTime)
      .reduce((sum, r) => sum + (r.searchTime || 0), 0) / searchResults.length

    return {
      success: true,
      query,
      totalProducts: allProducts.length,
      totalResults,
      products: allProducts,
      platformResults,
      searchOptions: options,
      searchTime: Date.now() - startTime,
      averagePlatformTime: averageSearchTime
    }

  } catch (error) {
    console.error('Multi-platform search error:', error)
    
    return {
      success: false,
      query,
      totalProducts: 0,
      totalResults: 0,
      products: [],
      platformResults: {},
      searchOptions: options,
      searchTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Helper function to sort products
function sortProducts(products: ExternalProduct[], sortBy: string): ExternalProduct[] {
  switch (sortBy) {
    case 'price':
      return products.sort((a, b) => a.price - b.price)
    
    case 'rating':
      return products.sort((a, b) => {
        const ratingA = a.rating || 0
        const ratingB = b.rating || 0
        return ratingB - ratingA // Highest rating first
      })
    
    case 'relevance':
    default:
      // For relevance, we could implement a scoring algorithm
      // For now, just return original order (relevance by platform)
      return products
  }
}

// Function to get best deals (lowest prices)
export function getBestDeals(products: ExternalProduct[], count: number = 10): ExternalProduct[] {
  return products
    .filter(product => product.price > 0)
    .sort((a, b) => a.price - b.price)
    .slice(0, count)
}

// Function to get products with biggest discounts
export function getBiggestDiscounts(products: ExternalProduct[], count: number = 10): ExternalProduct[] {
  return products
    .filter(product => product.originalPrice && product.originalPrice > product.price)
    .sort((a, b) => {
      const discountA = ((a.originalPrice! - a.price) / a.originalPrice!) * 100
      const discountB = ((b.originalPrice! - b.price) / b.originalPrice!) * 100
      return discountB - discountA // Biggest discount first
    })
    .slice(0, count)
}

// Function to get top-rated products
export function getTopRatedProducts(products: ExternalProduct[], count: number = 10): ExternalProduct[] {
  return products
    .filter(product => product.rating && product.rating > 0)
    .sort((a, b) => {
      const ratingA = a.rating || 0
      const ratingB = b.rating || 0
      if (ratingB !== ratingA) {
        return ratingB - ratingA
      }
      // If ratings are equal, prefer products with more reviews
      const reviewsA = a.reviewCount || 0
      const reviewsB = b.reviewCount || 0
      return reviewsB - reviewsA
    })
    .slice(0, count)
}
