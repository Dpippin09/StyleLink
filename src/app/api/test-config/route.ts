import { NextRequest, NextResponse } from 'next/server'

// Test API configuration endpoint
export async function GET(request: NextRequest) {
  try {
    const ebayAppId = process.env.EBAY_APP_ID
    const googleApiKey = process.env.GOOGLE_API_KEY
    const googleCSE = process.env.GOOGLE_CSE_ID
    const useRealAPIs = process.env.USE_REAL_APIS
    const fallbackToMock = process.env.FALLBACK_TO_MOCK
    
    const config = {
      useRealAPIs: useRealAPIs === 'true',
      fallbackToMock: fallbackToMock === 'true',
      apis: {
        ebay: {
          configured: !!(ebayAppId && ebayAppId !== 'your_actual_ebay_app_id_here'),
          hasKey: !!ebayAppId
        },
        google: {
          configured: !!(googleApiKey && googleCSE && 
                        googleApiKey !== 'your_google_api_key_here' && 
                        googleCSE !== 'your_custom_search_engine_id_here'),
          hasApiKey: !!googleApiKey,
          hasCSE: !!googleCSE
        }
      },
      recommendations: [] as string[]
    }
    
    // Add recommendations
    if (!config.useRealAPIs) {
      config.recommendations.push('Set USE_REAL_APIS=true in .env.local')
    }
    
    if (!config.apis.ebay.configured && !config.apis.google.configured) {
      config.recommendations.push('Add at least one API key (EBAY_APP_ID recommended)')
    }
    
    if (!config.apis.ebay.configured) {
      config.recommendations.push('Get eBay API key: https://developer.ebay.com/join/')
    }
    
    return NextResponse.json({
      success: true,
      message: 'API Configuration Status',
      config,
      ready: config.useRealAPIs && (config.apis.ebay.configured || config.apis.google.configured)
    })
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check API configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
