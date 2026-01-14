import { NextRequest, NextResponse } from 'next/server'
// TODO: Re-enable after Prisma client is properly generated
// import { productImportService } from '@/lib/product-import'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const config = {
      categories: body.categories || ['dress', 'shoes', 'shirt', 'pants', 'accessories'],
      productsPerCategory: body.productsPerCategory || 5,
      platforms: body.platforms || ['walmart', 'amazon', 'etsy'],
      updateExisting: body.updateExisting || false
    }

    console.log('🚀 Import API called with config:', config)
    
    // TODO: Re-enable after Prisma setup
    // const stats = await productImportService.importProducts(config)
    
    return NextResponse.json({
      success: true,
      stats: {
        totalSearched: 0,
        totalImported: 0,
        totalUpdated: 0,
        totalSkipped: 0,
        errors: [],
        duration: 0
      },
      message: `Import service will be enabled after Prisma client setup`
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
    // TODO: Re-enable after Prisma setup  
    // const stats = await productImportService.getImportStats()
    
    return NextResponse.json({
      success: true,
      stats: {
        totalProducts: 0,
        totalCategories: 0,
        lastImport: null
      }
    })
    
  } catch (error) {
    console.error('Import stats API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
