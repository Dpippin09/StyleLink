import { NextRequest, NextResponse } from 'next/server'

export interface CartItem {
  id: string
  productId: string
  title: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  imageUrl: string
  retailerUrl: string
  affiliate_url?: string
  retailer: string
  brand: string
  category: string
  selectedSize?: string
  selectedColor?: string
  quantity: number
  addedAt: string
  inStock: boolean
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  totalItems: number
  subtotal: number
  estimatedTax: number
  estimatedTotal: number
  createdAt: string
  updatedAt: string
}

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user'
    
    const cart = await getCart(userId)
    
    return NextResponse.json({
      success: true,
      cart
    })
    
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get cart' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      userId = 'demo-user',
      productId,
      title,
      description,
      price,
      originalPrice,
      currency = 'USD',
      imageUrl,
      retailerUrl,
      affiliate_url,
      retailer,
      brand,
      category,
      selectedSize,
      selectedColor,
      quantity = 1
    } = body
    
    // Validate required fields
    if (!productId || !title || !price || !retailerUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required product fields' },
        { status: 400 }
      )
    }
    
    const cart = await addItemToCart(userId, {
      id: `cart-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId,
      title,
      description,
      price,
      originalPrice,
      currency,
      imageUrl,
      retailerUrl,
      affiliate_url,
      retailer,
      brand,
      category,
      selectedSize,
      selectedColor,
      quantity,
      addedAt: new Date().toISOString(),
      inStock: true // Assume in stock when adding
    })
    
    return NextResponse.json({
      success: true,
      cart,
      message: 'Item added to cart'
    })
    
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

// PUT /api/cart - Update cart item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = 'demo-user', itemId, quantity, selectedSize, selectedColor } = body
    
    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      )
    }
    
    const cart = await updateCartItem(userId, itemId, {
      quantity,
      selectedSize,
      selectedColor
    })
    
    return NextResponse.json({
      success: true,
      cart,
      message: 'Cart item updated'
    })
    
  } catch (error) {
    console.error('Update cart error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user'
    const itemId = searchParams.get('itemId')
    
    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      )
    }
    
    const cart = await removeItemFromCart(userId, itemId)
    
    return NextResponse.json({
      success: true,
      cart,
      message: 'Item removed from cart'
    })
    
  } catch (error) {
    console.error('Remove from cart error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove item from cart' },
      { status: 500 }
    )
  }
}

// Demo cart storage (in production, use database)
const cartStorage: Map<string, Cart> = new Map()

// Get or create cart for user
async function getCart(userId: string): Promise<Cart> {
  let cart = cartStorage.get(userId)
  
  if (!cart) {
    cart = {
      id: `cart-${userId}-${Date.now()}`,
      userId,
      items: [],
      totalItems: 0,
      subtotal: 0,
      estimatedTax: 0,
      estimatedTotal: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    cartStorage.set(userId, cart)
  }
  
  return cart
}

// Add item to cart
async function addItemToCart(userId: string, item: CartItem): Promise<Cart> {
  const cart = await getCart(userId)
  
  // Check if item already exists
  const existingItemIndex = cart.items.findIndex(
    i => i.productId === item.productId && 
         i.selectedSize === item.selectedSize && 
         i.selectedColor === item.selectedColor
  )
  
  if (existingItemIndex > -1) {
    // Update quantity
    cart.items[existingItemIndex].quantity += item.quantity
  } else {
    // Add new item
    cart.items.push(item)
  }
  
  updateCartTotals(cart)
  cart.updatedAt = new Date().toISOString()
  cartStorage.set(userId, cart)
  
  return cart
}

// Update cart item
async function updateCartItem(
  userId: string, 
  itemId: string, 
  updates: Partial<Pick<CartItem, 'quantity' | 'selectedSize' | 'selectedColor'>>
): Promise<Cart> {
  const cart = await getCart(userId)
  
  const itemIndex = cart.items.findIndex(i => i.id === itemId)
  if (itemIndex === -1) {
    throw new Error('Item not found in cart')
  }
  
  // Update item
  if (updates.quantity !== undefined) {
    if (updates.quantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = updates.quantity
    }
  }
  
  if (updates.selectedSize !== undefined) {
    cart.items[itemIndex].selectedSize = updates.selectedSize
  }
  
  if (updates.selectedColor !== undefined) {
    cart.items[itemIndex].selectedColor = updates.selectedColor
  }
  
  updateCartTotals(cart)
  cart.updatedAt = new Date().toISOString()
  cartStorage.set(userId, cart)
  
  return cart
}

// Remove item from cart
async function removeItemFromCart(userId: string, itemId: string): Promise<Cart> {
  const cart = await getCart(userId)
  
  cart.items = cart.items.filter(i => i.id !== itemId)
  
  updateCartTotals(cart)
  cart.updatedAt = new Date().toISOString()
  cartStorage.set(userId, cart)
  
  return cart
}

// Update cart totals
function updateCartTotals(cart: Cart): void {
  cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0)
  cart.subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  cart.estimatedTax = cart.subtotal * 0.08 // 8% tax estimate
  cart.estimatedTotal = cart.subtotal + cart.estimatedTax
  
  // Round to 2 decimal places
  cart.subtotal = Math.round(cart.subtotal * 100) / 100
  cart.estimatedTax = Math.round(cart.estimatedTax * 100) / 100
  cart.estimatedTotal = Math.round(cart.estimatedTotal * 100) / 100
}
