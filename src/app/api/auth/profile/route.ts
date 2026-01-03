import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'

const prisma = new PrismaClient()

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const profileData = await request.json()

    // Update or create profile
    const user = await prisma.user.update({
      where: { id: currentUser.userId },
      data: {
        profile: {
          upsert: {
            create: profileData,
            update: profileData
          }
        }
      },
      include: { profile: true }
    })

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

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
