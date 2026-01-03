import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('Login endpoint called, NODE_ENV:', process.env.NODE_ENV)
    console.log('Prisma available:', !!prisma)
    
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if prisma is available
    if (!prisma) {
      console.log('Database not available, using demo authentication')
      
      // Demo authentication for production when database is not available
      if (email === 'demo@stylelink.com' && password === 'demo123') {
        console.log('Demo authentication successful')
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

        try {
          // Generate token for demo user
          const token = generateToken({
            userId: mockUser.id,
            email: mockUser.email
          })
          console.log('Token generated successfully')

          // Set cookie
          await setAuthCookie(token)
          console.log('Cookie set successfully')

          return NextResponse.json({
            success: true,
            user: mockUser
          })
        } catch (tokenError) {
          console.error('Error in demo token generation:', tokenError)
          return NextResponse.json(
            { error: 'Authentication error' },
            { status: 500 }
          )
        }
      } else {
        console.log('Invalid demo credentials provided')
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }
    }

    console.log('Database available, using normal authentication')
    // Database is available, use normal authentication
    const user = await prisma.user.findUnique({
      where: { email }
    }) as any  // Type assertion to access password field

    if (!user) {
      console.log(`Login attempt failed: User not found for email ${email}`)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      console.log(`Login attempt failed: Invalid password for email ${email}`)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Get user profile separately
    const userProfile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email
    })

    // Set cookie
    await setAuthCookie(token)

    // Return user data (without password)
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: userProfile
    }

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
