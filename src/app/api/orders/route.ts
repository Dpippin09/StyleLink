import { NextRequest, NextResponse } from 'next/server';

// This would normally connect to your database
// For now, we'll return mock order data
export async function GET(request: NextRequest) {
  const mockOrders = [
    {
      id: 'sl_order_123456',
      paymentIntentId: 'pi_test_123456',
      productName: 'Premium Cashmere Sweater',
      retailerName: 'Nordstrom',
      amount: 17900, // $179.00 in cents
      styleLinkFee: 537, // 3% fee
      retailerAmount: 17363,
      status: 'completed',
      createdAt: '2025-01-05T10:30:00Z',
      customerEmail: 'customer@example.com',
      trackingNumber: 'TRK123456789',
    },
    {
      id: 'sl_order_789012',
      paymentIntentId: 'pi_test_789012',
      productName: 'Designer Leather Jacket',
      retailerName: 'Zara',
      amount: 25000,
      styleLinkFee: 750,
      retailerAmount: 24250,
      status: 'processing',
      createdAt: '2025-01-04T15:45:00Z',
      customerEmail: 'customer@example.com',
    }
  ];

  return NextResponse.json({
    orders: mockOrders,
    total: mockOrders.length
  });
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // Here you would save the order to your database
    // For now, we'll just return a mock response
    const newOrder = {
      id: `sl_order_${Date.now()}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newOrder);

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
