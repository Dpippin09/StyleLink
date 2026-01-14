import { NextRequest, NextResponse } from 'next/server'
import { scheduledImportService } from '@/lib/scheduled-import'

export async function GET() {
  try {
    const status = scheduledImportService.getStatus()
    return NextResponse.json({ 
      success: true, 
      jobs: status,
      message: `${status.length} scheduled jobs active`
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get import status' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    switch (action) {
      case 'start':
        scheduledImportService.startAll()
        return NextResponse.json({ 
          success: true, 
          message: 'Scheduled imports started' 
        })

      case 'stop':
        scheduledImportService.stopAll()
        return NextResponse.json({ 
          success: true, 
          message: 'Scheduled imports stopped' 
        })

      case 'status':
        const status = scheduledImportService.getStatus()
        return NextResponse.json({ 
          success: true, 
          jobs: status 
        })

      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid action. Use: start, stop, or status' 
        }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process request' 
    }, { status: 500 })
  }
}
