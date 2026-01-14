import { NextRequest, NextResponse } from 'next/server'
import { productImportService } from '@/lib/product-import'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const config = {
      categories: body.categories || ['dress', 'shoes', 'shirt', 'pants', 'accessories'],
      productsPerCategory: body.productsPerCategory || 5,
      platforms: body.platforms || ['walmart', 'amazon', 'etsy'],
      updateExisting: body.updateExisting || false
    }

    console.log('🚀 Starting product import with config:', config)
    
    const stats = await productImportService.importProducts(config)
    
    return NextResponse.json({
      success: true,
      stats,
      message: `Import completed: ${stats.totalImported} imported, ${stats.totalUpdated} updated, ${stats.totalSkipped} skipped`
    })
    
  } catch (error) {
    console.error('Import API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const stats = await productImportService.getImportStats()
    
    return NextResponse.json({
      success: true,
      stats
    })
    
  } catch (error) {
    console.error('Import stats API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
