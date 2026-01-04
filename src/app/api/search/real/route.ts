import { NextRequest, NextResponse } from 'next/server'
import { EbayAPI, GoogleShoppingAPI, ShopifyAPI, type RealAPIProduct, type APISearchResponse } from '@/lib/real-apis'

export interface RealProduct {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  imageUrl: string
  retailerUrl: string
  affiliate_url?: string
  retailer: string
  brand: string
  category: string
  sizes?: string[]
  colors?: string[]
  inStock: boolean
  rating?: number
  reviews?: number
  condition: 'new' | 'used' | 'refurbished'
}

export interface SearchAPIResponse {
  success: boolean
  products: RealProduct[]
  totalResults: number
  searchTime: number
  sources: string[]
  error?: string
  nextPage?: string
}

// Real product search API endpoint with live integrations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || searchParams.get('query')
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    const maxResults = parseInt(searchParams.get('maxResults') || '20')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const useRealAPIs = searchParams.get('useRealAPIs') === 'true'

    // Search real products from multiple sources
    const results = await searchRealProducts(query, {
      maxResults,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      useRealAPIs
    })
    
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes for real APIs
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Real product search API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        products: [],
        totalResults: 0,
        searchTime: 0,
        sources: [],
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// Search real products from multiple live APIs - NO MOCK DATA
async function searchRealProducts(
  query: string, 
  options: {
    maxResults?: number
    category?: string | null
    minPrice?: number
    maxPrice?: number
    useRealAPIs?: boolean
  } = {}
): Promise<SearchAPIResponse> {
  const startTime = Date.now()
  
  try {
    const { maxResults = 20 } = options
    
    // Force real APIs only - no mock fallback
    const useRealAPIs = process.env.USE_REAL_APIS === 'true'
    const fallbackToMock = process.env.FALLBACK_TO_MOCK === 'true'
    
    if (!useRealAPIs) {
      return {
        success: false,
        products: [],
        totalResults: 0,
        searchTime: Date.now() - startTime,
        sources: [],
        error: 'Real APIs disabled. Set USE_REAL_APIS=true in .env.local and add API keys.'
      }
    }
    
    // Initialize real APIs with environment variables
    const ebayAppId = process.env.EBAY_APP_ID
    const googleApiKey = process.env.GOOGLE_API_KEY
    const googleCSE = process.env.GOOGLE_CSE_ID
    
    const apis = []
    
    // Add eBay API if configured
    if (ebayAppId && ebayAppId !== 'your_actual_ebay_app_id_here') {
      apis.push(new EbayAPI(ebayAppId))
    }
    
    // Add Google Shopping API if configured
    if (googleApiKey && googleCSE && 
        googleApiKey !== 'your_google_api_key_here' && 
        googleCSE !== 'your_custom_search_engine_id_here') {
      apis.push(new GoogleShoppingAPI(googleApiKey, googleCSE))
    }
    
    if (apis.length === 0) {
      return {
        success: false,
        products: [],
        totalResults: 0,
        searchTime: Date.now() - startTime,
        sources: [],
        error: 'No API keys configured. Please add EBAY_APP_ID to .env.local for real product data.'
      }
    }
    
    // Search all APIs in parallel
    const searchPromises = apis.map(async (api, index) => {
      try {
        console.log(`Searching with API ${index + 1}...`)
        const result = await api.searchProducts(query, {
          maxResults: Math.ceil(maxResults / apis.length),
          minPrice: options.minPrice,
          maxPrice: options.maxPrice
        })
        console.log(`API ${index + 1} returned ${result.products.length} products`)
        return result
      } catch (error) {
        console.error(`API ${index + 1} search error:`, error)
        return {
          success: false,
          products: [],
          totalResults: 0,
          searchTime: 0,
          source: `API ${index + 1}`,
          error: error instanceof Error ? error.message : 'Unknown error'
        } as APISearchResponse
      }
    })
    
    console.log(`Searching with ${apis.length} real APIs for: "${query}"`)
    const apiResults = await Promise.all(searchPromises)
    
    // Combine results from all APIs
    const allProducts: RealProduct[] = []
    const successfulSources: string[] = []
    let totalResults = 0
    let hasErrors: string[] = []
    
    for (const result of apiResults) {
      if (result.success && result.products.length > 0) {
        allProducts.push(...result.products.map(convertAPIProduct))
        successfulSources.push(result.source)
        totalResults += result.totalResults
        console.log(`✅ ${result.source}: ${result.products.length} products`)
      } else {
        hasErrors.push(result.source + ': ' + (result.error || 'No products'))
        console.log(`❌ ${result.source}: ${result.error || 'No products'}`)
      }
    }
    
    // Return error if no real products found and fallback disabled
    if (allProducts.length === 0) {
      return {
        success: false,
        products: [],
        totalResults: 0,
        searchTime: Date.now() - startTime,
        sources: [],
        error: `No real products found. Errors: ${hasErrors.join('; ')}. Check API keys and network connection.`
      }
    }
    
    // Sort by relevance and price
    const sortedProducts = allProducts
      .slice(0, maxResults)
      .sort((a, b) => {
        // Prioritize in-stock items
        if (a.inStock && !b.inStock) return -1
        if (!a.inStock && b.inStock) return 1
        
        // Then by price (ascending)
        return a.price - b.price
      })
    
    console.log(`✅ Returning ${sortedProducts.length} real products from: ${successfulSources.join(', ')}`)
    
    return {
      success: true,
      products: sortedProducts,
      totalResults,
      searchTime: Date.now() - startTime,
      sources: successfulSources
    }
    
  } catch (error) {
    console.error('Real product search error:', error)
    
    return {
      success: false,
      products: [],
      totalResults: 0,
      searchTime: Date.now() - startTime,
      sources: [],
      error: `Real API search failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please check API keys and try again.`
    }
  }
}

// Convert API product to our standard format
function convertAPIProduct(apiProduct: RealAPIProduct): RealProduct {
  return {
    id: apiProduct.id,
    title: apiProduct.title,
    description: apiProduct.description,
    price: apiProduct.price,
    originalPrice: apiProduct.originalPrice,
    currency: apiProduct.currency,
    imageUrl: apiProduct.imageUrl,
    retailerUrl: apiProduct.retailerUrl,
    affiliate_url: apiProduct.affiliate_url,
    retailer: apiProduct.retailer,
    brand: apiProduct.brand,
    category: apiProduct.category,
    sizes: apiProduct.sizes,
    colors: apiProduct.colors,
    inStock: apiProduct.inStock,
    rating: apiProduct.rating,
    reviews: apiProduct.reviews,
    condition: apiProduct.condition
  }
}
