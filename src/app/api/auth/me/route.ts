import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Me endpoint called - demo mode')
    
    // Always return demo user in demo mode
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
        bio: 'Fashion enthusiast who loves mixing classic pieces with trendy accessories.',
        location: 'New York, NY',
        birthDate: null,
        gender: 'female',
        styleTypes: 'minimalist,classic,trendy',
        sizePreference: 'M',
        colorPreferences: 'black,white,navy,pink',
        priceRange: 'mid-range',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }

    return NextResponse.json(mockUser)

  } catch (error) {
    console.error('Me endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
