import { NextRequest, NextResponse } from 'next/server'
import { searchMultiplePlatforms, SearchOptions } from '@/lib/search-aggregator'

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

    // Parse search options from query parameters
    const options: SearchOptions = {}
    
    // Parse platforms
    const platformsParam = searchParams.get('platforms')
    if (platformsParam) {
      options.platforms = platformsParam.split(',') as ('ebay' | 'walmart' | 'amazon' | 'google')[]
    }
    
    // Parse category
    const category = searchParams.get('category')
    if (category) {
      options.category = category
    }
    
    // Parse max results
    const maxResults = searchParams.get('maxResults')
    if (maxResults) {
      options.maxResultsPerPlatform = parseInt(maxResults)
    }
    
    // Parse sort order
    const sortBy = searchParams.get('sortBy')
    if (sortBy && ['price', 'relevance', 'rating'].includes(sortBy)) {
      options.sortBy = sortBy as 'price' | 'relevance' | 'rating'
    }
    
    // Parse price range
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    if (minPrice || maxPrice) {
      options.priceRange = {
        min: minPrice ? parseFloat(minPrice) : 0,
        max: maxPrice ? parseFloat(maxPrice) : Infinity
      }
    }

    // Execute the search
    const results = await searchMultiplePlatforms(query, options)
    
    // Return results with CORS headers for frontend access
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('External search API error:', error)
    
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
