import { ExternalProduct, SearchResponse, CLOTHING_CATEGORIES } from './external-search'

export async function searchEbay(
  query: string, 
  category?: string, 
  maxResults: number = 20
): Promise<SearchResponse> {
  const startTime = Date.now()
  
  // Check if we have a real eBay App ID
  const ebayAppId = process.env.EBAY_APP_ID || process.env.NEXT_PUBLIC_EBAY_APP_ID
  
  if (!ebayAppId || ebayAppId.includes('your_actual_ebay_app_id_here') || ebayAppId === 'YourAppI-d') {
    console.log('eBay App ID not configured, using empty results')
    return {
      products: [],
      totalResults: 0,
      searchTime: Date.now() - startTime,
      platform: 'ebay',
      success: false
    }
  }
  
  try {
    // Use sandbox URL for SBX App IDs, production URL for others
    const isSandbox = ebayAppId.includes('-SBX-');
    const baseUrl = isSandbox 
      ? 'https://svcs.sandbox.ebay.com/services/search/FindingService/v1'
      : 'https://svcs.ebay.com/services/search/FindingService/v1';
    
    // Build eBay Finding API URL
    const params = new URLSearchParams({
      'OPERATION-NAME': 'findItemsByKeywords',
      'SERVICE-VERSION': '1.0.0',
      'SECURITY-APPNAME': ebayAppId,
      'RESPONSE-DATA-FORMAT': 'JSON',
      'REST-PAYLOAD': 'true',
      'keywords': query,
      'paginationInput.entriesPerPage': maxResults.toString(),
      'sortOrder': 'PricePlusShipping',
      'itemFilter(0).name': 'Condition',
      'itemFilter(0).value(0)': 'New',
      'itemFilter(1).name': 'LocatedIn',
      'itemFilter(1).value(0)': 'US'
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
  
  // Return empty results - real products will come from API integrations
  const mockProducts: ExternalProduct[] = []
  
  return {
    success: true,
    platform: 'eBay',
    products: mockProducts,
    totalResults: mockProducts.length,
    searchTime: Date.now() - startTime
  }
}
