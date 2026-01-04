import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    // Demo mode - always return success with mock data
    const profileData = await request.json()

    // Mock updated user response
    const mockUser = {
      id: 'demo-user-id',
      email: 'demo@stylelink.com',
      name: 'Demo User',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        id: 'demo-profile-id',
        userId: 'demo-user-id',
        ...profileData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      user: mockUser
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
