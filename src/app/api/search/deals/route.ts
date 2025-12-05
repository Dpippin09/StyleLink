import { NextRequest, NextResponse } from 'next/server'
import { searchMultiplePlatforms } from '@/lib/search-aggregator'
import { getBestDeals, getBiggestDiscounts, getTopRatedProducts } from '@/lib/search-aggregator'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || searchParams.get('query') || 'clothing fashion'
    const dealType = searchParams.get('type') || 'best' // best, discounts, rated
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Get search results from all platforms
    const searchResults = await searchMultiplePlatforms(query, {
      platforms: ['ebay', 'walmart', 'amazon', 'google'],
      maxResultsPerPlatform: 25 // Get more results to find better deals
    })
    
    if (!searchResults.success) {
      return NextResponse.json(
        { error: 'Failed to search for deals', details: searchResults.error },
        { status: 500 }
      )
    }
    
    let deals
    let dealTypeDescription
    
    switch (dealType) {
      case 'discounts':
        deals = getBiggestDiscounts(searchResults.products, limit)
        dealTypeDescription = 'Biggest Discounts'
        break
        
      case 'rated':
        deals = getTopRatedProducts(searchResults.products, limit)
        dealTypeDescription = 'Top Rated Products'
        break
        
      case 'best':
      default:
        deals = getBestDeals(searchResults.products, limit)
        dealTypeDescription = 'Best Deals (Lowest Prices)'
        break
    }
    
    const response = {
      success: true,
      dealType,
      dealTypeDescription,
      query,
      totalDeals: deals.length,
      deals,
      searchTime: searchResults.searchTime,
      platforms: Object.keys(searchResults.platformResults),
      generatedAt: new Date().toISOString()
    }
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=600', // Cache for 10 minutes
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Deals API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
