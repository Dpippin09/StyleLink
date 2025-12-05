import { ExternalProduct, SearchResponse, CLOTHING_CATEGORIES } from './external-search'

export async function searchEbay(
  query: string, 
  category?: string, 
  maxResults: number = 20
): Promise<SearchResponse> {
  const startTime = Date.now()
  
  try {
    // Build eBay Finding API URL
    const baseUrl = 'https://svcs.ebay.com/services/search/FindingService/v1'
    const params = new URLSearchParams({
      'OPERATION-NAME': 'findItemsByKeywords',
      'SERVICE-VERSION': '1.0.0',
      'SECURITY-APPNAME': 'YourAppI-d', // You'll need to get a free eBay app ID
      'RESPONSE-DATA-FORMAT': 'JSON',
      'REST-PAYLOAD': 'true',
      'keywords': query,
      'paginationInput.entriesPerPage': maxResults.toString(),
      'sortOrder': 'PricePlusShipping',
      'itemFilter(0).name': 'Condition',
      'itemFilter(0).value': 'New',
      'itemFilter(1).name': 'LocatedIn',
      'itemFilter(1).value': 'US'
    })

    // Add category filter if specified
    if (category && CLOTHING_CATEGORIES.ebay[category as keyof typeof CLOTHING_CATEGORIES.ebay]) {
      params.append('categoryId', CLOTHING_CATEGORIES.ebay[category as keyof typeof CLOTHING_CATEGORIES.ebay])
    }

    const url = `${baseUrl}?${params}`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'StyleLink/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`eBay API error: ${response.status}`)
    }

    const data = await response.json()
    const searchResult = data.findItemsByKeywordsResponse?.[0]
    
    if (!searchResult || searchResult.ack[0] !== 'Success') {
      throw new Error('eBay API returned no results')
    }

    const items = searchResult.searchResult?.[0]?.item || []
    
    const products: ExternalProduct[] = items.map((item: any) => ({
      id: item.itemId[0],
      title: item.title[0],
      price: parseFloat(item.sellingStatus[0].currentPrice[0].__value__),
      currency: item.sellingStatus[0].currentPrice[0]['@currencyId'],
      imageUrl: item.galleryURL?.[0],
      productUrl: item.viewItemURL[0],
      platform: 'ebay' as const,
      condition: item.condition?.[0]?.conditionDisplayName?.[0]?.toLowerCase() || 'new',
      shipping: {
        cost: parseFloat(item.shippingInfo[0].shippingServiceCost[0].__value__ || '0'),
        free: item.shippingInfo[0].shippingType[0] === 'Free'
      },
      seller: {
        name: item.sellerInfo[0].sellerUserName[0]
      }
    }))

    return {
      success: true,
      platform: 'eBay',
      products,
      totalResults: parseInt(searchResult.paginationOutput[0].totalEntries[0]),
      searchTime: Date.now() - startTime
    }

  } catch (error) {
    console.error('eBay search error:', error)
    return {
      success: false,
      platform: 'eBay',
      products: [],
      searchTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Mock eBay search for development (when no API key available)
export async function searchEbayMock(
  query: string, 
  category?: string, 
  maxResults: number = 20
): Promise<SearchResponse> {
  const startTime = Date.now()
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const mockProducts: ExternalProduct[] = [
    {
      id: 'ebay-1',
      title: `${query} - Vintage Style Dress`,
      description: 'Beautiful vintage-inspired dress perfect for any occasion',
      price: 45.99,
      originalPrice: 65.99,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&auto=format&fit=crop',
      productUrl: 'https://ebay.com/item/123456789',
      platform: 'ebay',
      condition: 'new',
      shipping: { cost: 0, free: true },
      seller: { name: 'fashionstore123', rating: 4.8 }
    },
    {
      id: 'ebay-2', 
      title: `${query} - Designer Jeans`,
      description: 'Premium denim jeans with perfect fit',
      price: 89.99,
      originalPrice: 120.00,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&auto=format&fit=crop',
      productUrl: 'https://ebay.com/item/987654321',
      platform: 'ebay',
      condition: 'new',
      shipping: { cost: 5.99, free: false },
      seller: { name: 'denimworld', rating: 4.9 }
    }
  ]
  
  return {
    success: true,
    platform: 'eBay',
    products: mockProducts,
    totalResults: mockProducts.length,
    searchTime: Date.now() - startTime
  }
}
