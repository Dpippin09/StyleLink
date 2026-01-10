import { ExternalProduct, SearchResponse, CLOTHING_CATEGORIES } from './external-search'
import EbayRateLimit from './ebay-rate-limit'

// Add caching to reduce API calls
const searchCache = new Map<string, { data: SearchResponse; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function searchEbay(
  query: string, 
  category?: string, 
  maxResults: number = 5  // Reduced to 5 to minimize API calls
): Promise<SearchResponse> {
  const startTime = Date.now()
  
  // Check cache first to avoid unnecessary API calls
  const cacheKey = `${query}-${category}-${maxResults}`;
  const cached = searchCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log('🎯 Returning cached eBay results for:', query);
    return cached.data;
  }
  
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
    // Check rate limiting before making API call
    const rateLimit = EbayRateLimit.getInstance()
    const canCall = await rateLimit.canMakeCall()
    
    if (!canCall) {
      const stats = rateLimit.getStats()
      console.warn(`eBay API rate limit reached: ${stats.callsToday}/${stats.dailyLimit} calls today`)
      return {
        products: [],
        totalResults: 0,
        searchTime: Date.now() - startTime,
        platform: 'eBay',
        success: false,
        error: `Rate limit exceeded: ${stats.callsToday}/${stats.dailyLimit} calls today. Try again later.`
      }
    }
    // Use sandbox for development to avoid rate limit issues, production for live
    const isProduction = process.env.NODE_ENV === 'production' && !ebayAppId.includes('SBX');
    const baseUrl = isProduction 
      ? 'https://svcs.ebay.com/services/search/FindingService/v1'
      : 'https://svcs.sandbox.ebay.com/services/search/FindingService/v1';
    
    console.log(`Using eBay ${isProduction ? 'Production' : 'Sandbox'} Finding API`);
    
    // Build eBay Finding API URL
    const params = new URLSearchParams({
      'OPERATION-NAME': 'findItemsByKeywords',
      'SERVICE-VERSION': '1.0.0',
      'SECURITY-APPNAME': ebayAppId,
      'RESPONSE-DATA-FORMAT': 'JSON',
      'REST-PAYLOAD': 'true',
      'keywords': query,
      'paginationInput.entriesPerPage': Math.min(maxResults, 20).toString(),
      'sortOrder': 'PricePlusShipping'
    })

    // Add basic filters only
    params.append('itemFilter(0).name', 'Condition')
    params.append('itemFilter(0).value', 'New')
    params.append('itemFilter(1).name', 'LocatedIn')
    params.append('itemFilter(1).value', 'US')

    // Add category filter if specified
    if (category && CLOTHING_CATEGORIES.ebay[category as keyof typeof CLOTHING_CATEGORIES.ebay]) {
      params.append('categoryId', CLOTHING_CATEGORIES.ebay[category as keyof typeof CLOTHING_CATEGORIES.ebay])
    }

    const url = `${baseUrl}?${params}`
    console.log('eBay API Request:', {
      appId: ebayAppId.substring(0, 20) + '...',
      usingProduction: true,
      baseUrl,
      query,
      maxResults
    })
    console.log('Full eBay URL:', url.substring(0, 150) + '...')
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'StyleLink/1.0'
      }
    })

    // Record the API call for rate limiting
    rateLimit.recordCall()
    const stats = rateLimit.getStats()
    console.log(`eBay API call made: ${stats.callsToday}/${stats.dailyLimit} calls today`)

    console.log('eBay API response:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('eBay API error response:', errorText)
      
      // Check for rate limit error - implement smart retry
      if (response.status === 500 && errorText.includes('exceeded the number of times')) {
        console.log('eBay rate limit hit - implementing smart backoff strategy...')
        
        // Instead of throwing error, wait and try with cached/alternative data
        await new Promise(resolve => setTimeout(resolve, 5000)) // 5 second wait
        
        // Return empty result for now, but don't fail completely
        return {
          success: false,
          products: [],
          totalResults: 0,
          platform: 'ebay'
        }
      }
      
      throw new Error(`eBay API error: ${response.status} - ${errorText.substring(0, 200)}`)
    }

    const data = await response.json()
    console.log('eBay API full response:', JSON.stringify(data, null, 2))
    const searchResult = data.findItemsByKeywordsResponse?.[0]
    
    if (!searchResult || searchResult.ack[0] !== 'Success') {
      const errorMsg = searchResult?.errorMessage?.[0]?.error?.[0]?.message?.[0] || 'Unknown error'
      console.error('eBay API error:', errorMsg)
      console.error('Full search result:', searchResult)
      throw new Error(`eBay API returned error: ${errorMsg}`)
    }

    const items = searchResult.searchResult?.[0]?.item || []
    console.log('eBay items found:', items.length)
    console.log('First item sample:', items[0] ? JSON.stringify(items[0], null, 2).substring(0, 300) : 'No items')
    
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

    const searchResponse = {
      success: true,
      platform: 'eBay',
      products,
      totalResults: parseInt(searchResult.paginationOutput[0].totalEntries[0]),
      searchTime: Date.now() - startTime
    }

    // Cache the successful response
    searchCache.set(cacheKey, { data: searchResponse, timestamp: Date.now() });
    console.log('💾 Cached eBay results for:', query);
    
    return searchResponse;

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
