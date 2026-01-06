import { NextRequest, NextResponse } from 'next/server';
import { stripe, calculateStyleLinkFee, calculateRetailerAmount } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment system not configured - missing Stripe configuration' },
        { status: 500 }
      );
    }

    const { 
      amount, 
      currency = 'usd', 
      productId, 
      productName, 
      retailerName, 
      retailerAccountId 
    } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const styleLinkFee = calculateStyleLinkFee(amount);
    const retailerAmount = calculateRetailerAmount(amount);

    // Create payment intent with application fee
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Total amount in cents
      currency: currency,
      application_fee_amount: styleLinkFee, // StyleLink's 3% fee
      transfer_data: retailerAccountId ? {
        destination: retailerAccountId, // Retailer's connected account
      } : undefined,
      metadata: {
        productId: productId || '',
        productName: productName || '',
        retailerName: retailerName || '',
        styleLinkFee: styleLinkFee.toString(),
        retailerAmount: retailerAmount.toString(),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      breakdown: {
        total: amount,
        styleLinkFee: styleLinkFee,
        retailerAmount: retailerAmount,
        currency: currency
      }
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
