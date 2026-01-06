'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  amount: number;
  productName: string;
  productId: string;
  retailerName: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

function PaymentForm({ amount, productName, productId, retailerName, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [breakdown, setBreakdown] = useState<any>(null);

  const styleLinkFee = Math.round(amount * 0.03);
  const retailerAmount = amount - styleLinkFee;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          productId,
          productName,
          retailerName,
        }),
      });

      const { clientSecret, breakdown } = await response.json();
      setBreakdown(breakdown);

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (error) {
      onError('Payment processing failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Complete Your Purchase</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium">{productName}</p>
          <p className="text-sm text-gray-600">Sold by {retailerName}</p>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span>Product Price</span>
              <span>${(retailerAmount / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-purple-600">
              <span>StyleLink Service Fee (3%)</span>
              <span>${(styleLinkFee / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2">
              <span>Total</span>
              <span>${(amount / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-md p-3">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-md font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Your payment is secured by Stripe. StyleLink facilitates the transaction between you and {retailerName}.
        </p>
      </form>
    </div>
  );
}

interface StripePaymentProps extends PaymentFormProps {}

export default function StripePayment(props: StripePaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}
