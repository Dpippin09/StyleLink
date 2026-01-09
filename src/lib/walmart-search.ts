import { ExternalProduct, SearchResponse, CLOTHING_CATEGORIES } from './external-search'

export async function searchWalmart(
  query: string,
  category?: string,
  maxResults: number = 20
): Promise<SearchResponse> {
  const startTime = Date.now()
  
  try {
    // Note: Walmart API requires an API key, using mock data for now
    // To use real API, get key from: https://developer.walmartlabs.com/
    
    const apiKey = process.env.WALMART_API_KEY
    if (!apiKey) {
      // Return mock data if no API key
      return searchWalmartMock(query, category, maxResults)
    }

    const baseUrl = 'https://api.walmartlabs.com/v1/search'
    const params = new URLSearchParams({
      'apiKey': apiKey,
      'query': query,
      'format': 'json',
      'numItems': maxResults.toString(),
      'sort': 'price'
    })

    // Add category filter if specified
    if (category && CLOTHING_CATEGORIES.walmart[category as keyof typeof CLOTHING_CATEGORIES.walmart]) {
      params.append('categoryId', CLOTHING_CATEGORIES.walmart[category as keyof typeof CLOTHING_CATEGORIES.walmart])
    }

    const url = `${baseUrl}?${params}`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'StyleLink/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Walmart API error: ${response.status}`)
    }

    const data = await response.json()
    const items = data.items || []
    
    const products: ExternalProduct[] = items.map((item: any) => ({
      id: item.itemId.toString(),
      title: item.name,
      description: item.shortDescription,
      price: item.salePrice || item.msrp,
      originalPrice: item.msrp > item.salePrice ? item.msrp : undefined,
      currency: 'USD',
      imageUrl: item.mediumImage,
      productUrl: item.productUrl,
      platform: 'walmart' as const,
      brand: item.brandName,
      condition: 'new',
      shipping: {
        cost: 0,
        free: true // Walmart often has free shipping
      }
    }))

    return {
      success: true,
      platform: 'Walmart',
      products,
      totalResults: data.totalResults || items.length,
      searchTime: Date.now() - startTime
    }

  } catch (error) {
    console.error('Walmart search error:', error)
    // Fallback to mock data on error
    return searchWalmartMock(query, category, maxResults)
  }
}

// Mock Walmart search for development
export async function searchWalmartMock(
  query: string,
  category?: string,
  maxResults: number = 20
): Promise<SearchResponse> {
  const startTime = Date.now()
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Return empty results - real products will come from API integrations
  const mockProducts: ExternalProduct[] = []
  
  return {
    success: true,
    platform: 'Walmart',
    products: mockProducts.slice(0, maxResults),
    totalResults: mockProducts.length,
    searchTime: Date.now() - startTime
  }
}
