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
  
  const mockProducts: ExternalProduct[] = [
    {
      id: 'etsy-1',
      title: `Handmade ${query} - Bohemian Style Dress`,
      description: 'Beautiful handcrafted bohemian dress made with sustainable materials',
      price: 68.00,
      originalPrice: 85.00,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&auto=format&fit=crop',
      productUrl: 'https://etsy.com/listing/123456789',
      platform: 'etsy',
      brand: 'BohoCreations',
      condition: 'new',
      shipping: { cost: 5.95, free: false },
      seller: { name: 'BohoCreations', rating: 4.9 },
      category: 'Clothing'
    },
    {
      id: 'etsy-2',
      title: `Custom ${query} - Artisan Leather Belt`,
      description: 'Hand-stitched leather belt crafted by skilled artisans',
      price: 42.50,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&auto=format&fit=crop',
      productUrl: 'https://etsy.com/listing/987654321',
      platform: 'etsy',
      brand: 'LeatherCraft Co',
      condition: 'new',
      shipping: { cost: 0, free: true },
      seller: { name: 'LeatherCraft Co', rating: 4.8 },
      category: 'Accessories'
    },
    {
      id: 'etsy-3',
      title: `Vintage ${query} - Retro Band T-Shirt`,
      description: 'Authentic vintage band t-shirt from the 1980s in excellent condition',
      price: 35.00,
      originalPrice: 50.00,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&auto=format&fit=crop',
      productUrl: 'https://etsy.com/listing/456789123',
      platform: 'etsy',
      brand: 'VintageVibes',
      condition: 'used',
      shipping: { cost: 3.99, free: false },
      seller: { name: 'VintageVibes', rating: 4.7 },
      category: 'Vintage'
    },
    {
      id: 'etsy-4',
      title: `Sustainable ${query} - Organic Cotton Sweater`,
      description: 'Eco-friendly organic cotton sweater knitted with love',
      price: 89.99,
      originalPrice: 110.00,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&auto=format&fit=crop',
      productUrl: 'https://etsy.com/listing/789123456',
      platform: 'etsy',
      brand: 'EcoKnit Studio',
      condition: 'new',
      shipping: { cost: 0, free: true },
      seller: { name: 'EcoKnit Studio', rating: 4.9 },
      category: 'Clothing'
    },
    {
      id: 'etsy-5',
      title: `Handcrafted ${query} - Wooden Jewelry Box`,
      description: 'Beautiful handcrafted wooden jewelry box with intricate details',
      price: 125.00,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&auto=format&fit=crop',
      productUrl: 'https://etsy.com/listing/321654987',
      platform: 'etsy',
      brand: 'WoodWorks Studio',
      condition: 'new',
      shipping: { cost: 12.99, free: false },
      seller: { name: 'WoodWorks Studio', rating: 4.6 },
      category: 'Accessories'
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
