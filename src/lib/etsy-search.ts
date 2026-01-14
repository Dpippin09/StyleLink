import { ExternalProduct, SearchResponse, CLOTHING_CATEGORIES } from './external-search'

// Etsy API v3 integration
export async function searchEtsy(
  query: string,
  category?: string,
  maxResults: number = 20
): Promise<SearchResponse> {
  const startTime = Date.now()
  
  try {
    // Etsy API v3 requires OAuth 2.0 authentication
    // See: https://developers.etsy.com/documentation/
    
    const apiKey = process.env.ETSY_API_KEY
    if (!apiKey) {
      return searchEtsyMock(query, category, maxResults)
    }

    const baseUrl = 'https://openapi.etsy.com/v3/application/listings/active'
    const params = new URLSearchParams({
      'keywords': query,
      'limit': Math.min(maxResults, 100).toString(), // Etsy max is 100
      'sort_on': 'price',
      'sort_order': 'up',
      'includes': 'Images,Shop',
      'taxonomy_path': 'Clothing'
    })

    // Add category-specific taxonomy if specified
    if (category && CLOTHING_CATEGORIES.etsy[category as keyof typeof CLOTHING_CATEGORIES.etsy]) {
      params.set('taxonomy_path', CLOTHING_CATEGORIES.etsy[category as keyof typeof CLOTHING_CATEGORIES.etsy])
    }

    const url = `${baseUrl}?${params}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'x-api-key': apiKey,
        'User-Agent': 'StyleLink/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Etsy API error: ${response.status}`)
    }

    const data = await response.json()
    const listings = data.results || []
    
    const products: ExternalProduct[] = listings.map((listing: any) => ({
      id: listing.listing_id.toString(),
      title: listing.title,
      description: listing.description,
      price: parseFloat(listing.price.amount) / 100, // Etsy returns price in cents
      currency: listing.price.currency_code,
      imageUrl: listing.images?.[0]?.url_570xN,
      productUrl: listing.url,
      platform: 'etsy' as const,
      brand: listing.shop?.shop_name,
      condition: 'new', // Most Etsy items are handmade/new
      shipping: {
        cost: 0, // Would need separate API call to get shipping
        free: false
      },
      seller: {
        name: listing.shop?.shop_name,
        rating: listing.shop?.review_average
      },
      category: listing.taxonomy_path
    }))

    return {
      success: true,
      platform: 'Etsy',
      products,
      totalResults: data.count || listings.length,
      searchTime: Date.now() - startTime
    }

  } catch (error) {
    console.error('Etsy search error:', error)
    return searchEtsyMock(query, category, maxResults)
  }
}

// Mock Etsy search for development
export async function searchEtsyMock(
  query: string,
  category?: string,
  maxResults: number = 20
): Promise<SearchResponse> {
  const startTime = Date.now()
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400))
  
  // Return sample products when no API key is available
  const mockProducts: ExternalProduct[] = [
    {
      id: `etsy_${query}_1`,
      title: `Handcrafted ${query.charAt(0).toUpperCase() + query.slice(1)}`,
      price: 45.00,
      originalPrice: 55.00,
      currency: 'USD',
      imageUrl: 'https://via.placeholder.com/200x200?text=Etsy+Handmade',
      productUrl: 'https://etsy.com/sample',
      platform: 'etsy',
      description: `Beautiful handcrafted ${query} made by artisan sellers.`,
      brand: 'Artisan Made',
      condition: 'new'
    },
    {
      id: `etsy_${query}_2`,
      title: `Vintage ${query} Style`,
      price: 35.99,
      currency: 'USD',
      imageUrl: 'https://via.placeholder.com/200x200?text=Etsy+Vintage',
      productUrl: 'https://etsy.com/sample2',
      platform: 'etsy',
      description: `Unique vintage-inspired ${query} from creative sellers.`,
      brand: 'Vintage Collection',
      condition: 'new'
    }
  ]
  
  return {
    success: true,
    platform: 'Etsy',
    products: mockProducts.slice(0, maxResults),
    totalResults: mockProducts.length,
    searchTime: Date.now() - startTime
  }
}
