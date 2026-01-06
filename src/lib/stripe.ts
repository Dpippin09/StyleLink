import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
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
