import { NextRequest, NextResponse } from 'next/server'
import { Cart, CartItem } from '../cart/route'

export interface CheckoutSession {
  id: string
  userId: string
  cart: Cart
  shippingAddress?: ShippingAddress
  billingAddress?: ShippingAddress
  paymentMethod?: PaymentMethod
  orderSummary: OrderSummary
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
}

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay'
  last4?: string
  brand?: string
}

export interface OrderSummary {
  subtotal: number
  tax: number
  shipping: number
  stylelinkFee: number
  total: number
  currency: string
}

export interface PurchaseRedirect {
  retailer: string
  url: string
  items: CartItem[]
  stylelinkOrderId: string
}

// POST /api/checkout - Create checkout session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = 'demo-user', action = 'create' } = body
    
    if (action === 'create') {
      const session = await createCheckoutSession(userId)
      
      return NextResponse.json({
        success: true,
        session
      })
    }
    
    if (action === 'complete') {
      const { 
        sessionId, 
        shippingAddress, 
        billingAddress, 
        paymentMethod 
      } = body
      
      const result = await completeCheckout(sessionId, {
        shippingAddress,
        billingAddress,
        paymentMethod
      })
      
      return NextResponse.json({
        success: true,
        ...result
      })
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { success: false, error: 'Checkout failed' },
      { status: 500 }
    )
  }
}

// GET /api/checkout - Get checkout session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      )
    }
    
    const session = checkoutStorage.get(sessionId)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      session
    })
    
  } catch (error) {
    console.error('Get checkout session error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get session' },
      { status: 500 }
    )
  }
}

// Demo storage (in production, use database)
const checkoutStorage: Map<string, CheckoutSession> = new Map()

// Create checkout session
async function createCheckoutSession(userId: string): Promise<CheckoutSession> {
  // Get user's cart (simplified - in production, fetch from cart API)
  const cart: Cart = {
    id: `cart-${userId}`,
    userId,
    items: [], // Would be populated from actual cart
    totalItems: 0,
    subtotal: 0,
    estimatedTax: 0,
    estimatedTotal: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  // Calculate order summary
  const shipping = calculateShipping(cart)
  const stylelinkFee = calculateStylelinkFee(cart.subtotal)
  
  const orderSummary: OrderSummary = {
    subtotal: cart.subtotal,
    tax: cart.estimatedTax,
    shipping,
    stylelinkFee,
    total: cart.subtotal + cart.estimatedTax + shipping + stylelinkFee,
    currency: 'USD'
  }
  
  const session: CheckoutSession = {
    id: `checkout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    cart,
    orderSummary,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
  
  checkoutStorage.set(session.id, session)
  return session
}

// Complete checkout and create purchase redirects
async function completeCheckout(
  sessionId: string, 
  details: {
    shippingAddress: ShippingAddress
    billingAddress?: ShippingAddress
    paymentMethod: PaymentMethod
  }
): Promise<{
  orderId: string
  purchaseRedirects: PurchaseRedirect[]
  trackingEmails: string[]
}> {
  
  const session = checkoutStorage.get(sessionId)
  if (!session) {
    throw new Error('Checkout session not found')
  }
  
  // Update session with details
  session.shippingAddress = details.shippingAddress
  session.billingAddress = details.billingAddress || details.shippingAddress
  session.paymentMethod = details.paymentMethod
  session.status = 'processing'
  
  // Group cart items by retailer
  const itemsByRetailer = groupItemsByRetailer(session.cart.items)
  
  // Create purchase redirects for each retailer
  const purchaseRedirects: PurchaseRedirect[] = []
  const trackingEmails: string[] = []
  
  for (const [retailerName, items] of itemsByRetailer) {
    const stylelinkOrderId = `SL-${Date.now()}-${retailerName.substring(0, 3).toUpperCase()}`
    
    // Create affiliate purchase URL
    const purchaseUrl = await createRetailerPurchaseUrl(retailerName, items, stylelinkOrderId)
    
    purchaseRedirects.push({
      retailer: retailerName,
      url: purchaseUrl,
      items,
      stylelinkOrderId
    })
    
    // Send tracking email (simulated)
    trackingEmails.push(await sendTrackingEmail(details.shippingAddress.firstName, stylelinkOrderId, retailerName))
  }
  
  // Complete session
  session.status = 'completed'
  session.completedAt = new Date().toISOString()
  checkoutStorage.set(sessionId, session)
  
  const orderId = `SL-ORDER-${Date.now()}`
  
  return {
    orderId,
    purchaseRedirects,
    trackingEmails
  }
}

// Group cart items by retailer
function groupItemsByRetailer(items: CartItem[]): Map<string, CartItem[]> {
  const groups = new Map<string, CartItem[]>()
  
  for (const item of items) {
    const retailer = item.retailer
    if (!groups.has(retailer)) {
      groups.set(retailer, [])
    }
    groups.get(retailer)!.push(item)
  }
  
  return groups
}

// Create retailer-specific purchase URL with cart pre-filled
async function createRetailerPurchaseUrl(
  retailer: string, 
  items: CartItem[], 
  stylelinkOrderId: string
): Promise<string> {
  
  // Different retailers have different URL formats for cart/checkout
  const retailerConfigs: Record<string, any> = {
    'Amazon': {
      baseUrl: 'https://amazon.com/gp/aws/cart/add.html',
      params: (items: CartItem[]) => {
        const params = new URLSearchParams()
        items.forEach((item, index) => {
          params.append(`ASIN.${index + 1}`, extractProductId(item.retailerUrl))
          params.append(`Quantity.${index + 1}`, item.quantity.toString())
        })
        params.append('tag', 'stylelink-20') // Affiliate tag
        params.append('ref', stylelinkOrderId)
        return params.toString()
      }
    },
    'Zara': {
      baseUrl: 'https://zara.com/checkout',
      params: (items: CartItem[]) => {
        const params = new URLSearchParams()
        params.append('ref', 'stylelink')
        params.append('order_id', stylelinkOrderId)
        // Zara would require API integration for cart pre-fill
        return params.toString()
      }
    },
    'H&M': {
      baseUrl: 'https://www2.hm.com/en_us/shopping-bag',
      params: (items: CartItem[]) => {
        const params = new URLSearchParams()
        params.append('affiliate', 'stylelink')
        params.append('ref', stylelinkOrderId)
        return params.toString()
      }
    },
    'ASOS': {
      baseUrl: 'https://asos.com/bag',
      params: (items: CartItem[]) => {
        const params = new URLSearchParams()
        params.append('affid', 'stylelink')
        params.append('ref', stylelinkOrderId)
        return params.toString()
      }
    },
    'Nordstrom': {
      baseUrl: 'https://nordstrom.com/shopping-bag',
      params: (items: CartItem[]) => {
        const params = new URLSearchParams()
        params.append('campaign', 'stylelink')
        params.append('ref', stylelinkOrderId)
        return params.toString()
      }
    }
  }
  
  const config = retailerConfigs[retailer] || {
    baseUrl: items[0]?.retailerUrl || 'https://example.com',
    params: () => `ref=${stylelinkOrderId}`
  }
  
  const queryString = config.params(items)
  return `${config.baseUrl}?${queryString}`
}

// Extract product ID from retailer URL
function extractProductId(url: string): string {
  const matches = url.match(/\/([a-zA-Z0-9-]+)\/?$/)
  return matches ? matches[1] : 'unknown'
}

// Send tracking email (simulated)
async function sendTrackingEmail(
  customerName: string, 
  orderId: string, 
  retailer: string
): Promise<string> {
  
  const emailContent = `
    Hi ${customerName},
    
    Your StyleLink order ${orderId} for ${retailer} is being processed.
    
    You will be redirected to ${retailer} to complete your purchase.
    We'll send you tracking information once your order ships.
    
    Thank you for shopping with StyleLink!
  `
  
  // In production: send actual email via service like SendGrid, AWS SES, etc.
  console.log(`Sending tracking email for order ${orderId}:`, emailContent)
  
  return `Email sent for order ${orderId}`
}

// Calculate shipping cost
function calculateShipping(cart: Cart): number {
  if (cart.subtotal >= 75) return 0 // Free shipping over $75
  return 8.99 // Standard shipping
}

// Calculate StyleLink service fee
function calculateStylelinkFee(subtotal: number): number {
  return Math.round(subtotal * 0.03 * 100) / 100 // 3% service fee
}
