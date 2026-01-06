import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature found' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('✅ Payment succeeded:', paymentIntent.id);
        
        // Here you would:
        // 1. Update your database with the successful payment
        // 2. Send confirmation emails to customer and retailer
        // 3. Notify retailer about the order
        // 4. Update inventory if needed
        
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('❌ Payment failed:', failedPayment.id);
        
        await handlePaymentFailure(failedPayment);
        break;

      case 'application_fee.created':
        const fee = event.data.object;
        console.log('💰 StyleLink fee collected:', fee.amount);
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  // Extract metadata
  const { 
    productId, 
    productName, 
    retailerName, 
    styleLinkFee, 
    retailerAmount 
  } = paymentIntent.metadata;

  console.log('Processing successful payment:', {
    paymentId: paymentIntent.id,
    productName,
    retailerName,
    styleLinkFee: `$${(parseInt(styleLinkFee) / 100).toFixed(2)}`,
    retailerAmount: `$${(parseInt(retailerAmount) / 100).toFixed(2)}`,
  });

  // TODO: Add your business logic here:
  // - Save order to database
  // - Send emails
  // - Update inventory
  // - Notify retailer
}

async function handlePaymentFailure(paymentIntent: any) {
  console.log('Payment failed:', {
    paymentId: paymentIntent.id,
    amount: paymentIntent.amount,
    lastPaymentError: paymentIntent.last_payment_error?.message,
  });

  // TODO: Add failure handling:
  // - Log the failure
  // - Send failure notification to customer
  // - Update order status
}
