import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Check if Stripe is configured
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripeSecretKey) {
  console.warn('⚠️ STRIPE_SECRET_KEY not found. Stripe payments will not work.');
}

// Server-side Stripe instance (only initialize if key is available)
export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-12-15.clover',
    })
  : null;

// Client-side Stripe instance
export const getStripe = () => {
  if (!stripePublishableKey) {
    console.warn('⚠️ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not found');
    return null;
  }
  return loadStripe(stripePublishableKey);
};

// StyleLink business logic
export const STYLELINK_FEE_PERCENTAGE = parseInt(process.env.STYLELINK_FEE_PERCENTAGE || '3');

export const calculateStyleLinkFee = (amount: number): number => {
  return Math.round(amount * (STYLELINK_FEE_PERCENTAGE / 100));
};

export const calculateRetailerAmount = (totalAmount: number): number => {
  const styleLinkFee = calculateStyleLinkFee(totalAmount);
  return totalAmount - styleLinkFee;
};

// Stripe Connect helper for multi-party payments
export const createConnectedAccount = async (retailerEmail: string, retailerName: string) => {
  if (!stripe) {
    throw new Error('Stripe not configured - missing STRIPE_SECRET_KEY');
  }
  
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      email: retailerEmail,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        name: retailerName,
      },
    });
    return account;
  } catch (error) {
    console.error('Error creating connected account:', error);
    throw error;
  }
};
