import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get user from token
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get user's wishlist items
    const wishlistItems = await prisma!.wishlistItem.findMany({
      where: { userId: payload.userId },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1
            },
            brand: true,
            category: true
          }
        }
      },
      orderBy: { addedAt: 'desc' }
    })

    // Transform to match frontend expectations
    const formattedItems = wishlistItems.map(item => ({
      id: item.id,
      title: item.product.name,
      brand: item.product.brand.name,
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      image: item.product.images[0]?.url || '/placeholder-image.jpg',
      category: item.product.category.name,
      addedAt: item.addedAt.toISOString(),
      productId: item.product.id
    }))

    return NextResponse.json({
      success: true,
      wishlistItems: formattedItems
    })

  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user from token
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { productId } = await request.json()
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma!.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Add to wishlist (using upsert to handle duplicates)
    const wishlistItem = await prisma!.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId: payload.userId,
          productId: productId
        }
      },
      update: {},
      create: {
        userId: payload.userId,
        productId: productId
      },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1
            },
            brand: true,
            category: true
          }
        }
      }
    })

    // Format response
    const formattedItem = {
      id: wishlistItem.id,
      title: wishlistItem.product.name,
      brand: wishlistItem.product.brand.name,
      price: wishlistItem.product.price,
      originalPrice: wishlistItem.product.originalPrice,
      image: wishlistItem.product.images[0]?.url || '/placeholder-image.jpg',
      category: wishlistItem.product.category.name,
      addedAt: wishlistItem.addedAt.toISOString(),
      productId: wishlistItem.product.id
    }

    return NextResponse.json({
      success: true,
      message: 'Item added to wishlist',
      item: formattedItem
    })

  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get user from token
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Remove from wishlist
    await prisma!.wishlistItem.deleteMany({
      where: {
        userId: payload.userId,
        productId: productId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Item removed from wishlist'
    })

  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}
