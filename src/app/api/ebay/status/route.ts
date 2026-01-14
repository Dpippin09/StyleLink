import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check eBay API configuration
    const appId = process.env.EBAY_APP_ID
    const isConfigured = !!appId
    
    return NextResponse.json({
      success: true,
      configured: isConfigured,
      message: isConfigured 
        ? 'eBay API is configured and ready' 
        : 'eBay API not configured - missing EBAY_APP_ID',
      appIdPresent: !!appId,
      endpoint: appId?.startsWith('PRD-') ? 'production' : 'sandbox'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      configured: false,
      error: 'Failed to check eBay status'
    }, { status: 500 })
  }
}