import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('Me endpoint called')
    
    const currentUser = await getCurrentUser()
    console.log('Current user from token:', currentUser)
    
    if (!currentUser) {
      console.log('No current user found, returning 401')
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if prisma is available
    if (!prisma) {
      console.log('Database not available, returning demo user data')
      
      // Return demo user data when database is not available
      if (currentUser.email === 'demo@stylelink.com') {
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
        
        console.log('Returning demo user data')
        return NextResponse.json(mockUser)
      } else {
        console.log('User not demo user, returning 404')
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }
    }

    console.log('Database available, fetching user from database')
    // Database is available, get user data from database
    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
      include: { profile: true }
    })

    if (!user) {
      console.log('User not found in database')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('User found in database, returning user data')
    // Return user data (without password)
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: user.profile
    }

    return NextResponse.json(userWithoutPassword)

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
