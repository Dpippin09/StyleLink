# StyleLink Stripe Integration Setup Guide

## Overview
StyleLink uses Stripe to process payments with a 3% service fee model. This allows users to purchase products through StyleLink while the payment goes to retailers, with StyleLink keeping a finder's fee.

## Quick Setup Steps

### 1. Create Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up for a new account or sign in
3. Complete account verification

### 2. Get API Keys
1. In Stripe Dashboard, go to **Developers** > **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_` for test mode)
3. Copy your **Secret Key** (starts with `sk_test_` for test mode)

### 3. Update Environment Variables
In your `.env.local` file, replace the placeholders:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# StyleLink Business Configuration
STYLELINK_FEE_PERCENTAGE=3
NEXT_PUBLIC_DOMAIN=http://localhost:3000
```

### 4. Set Up Webhooks (Important!)
1. In Stripe Dashboard, go to **Developers** > **Webhooks**
2. Click **Add endpoint**
3. Set URL to: `http://localhost:3000/api/payments/webhook` (for local development)
4. Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `application_fee.created`
5. Copy the **Signing secret** to `STRIPE_WEBHOOK_SECRET`

### 5. Test the Integration
1. Start your dev server: `npm run dev`
2. Search for a product and click "Buy Now"
3. Use Stripe test card: `4242 4242 4242 4242`
4. Any future date for expiry, any 3-digit CVC

## How StyleLink's Payment Flow Works

### 1. Customer Journey
- User searches for products
- Clicks "Buy Now" on any product
- Redirected to Stripe checkout with StyleLink branding
- Pays total amount (product price + 3% StyleLink fee)

### 2. Payment Processing
- Stripe processes the full payment
- StyleLink automatically receives 3% service fee
- Remaining amount goes to retailer (when connected accounts are set up)
- Customer receives confirmation email
- Retailer is notified to fulfill order

### 3. Order Management
- All orders tracked in StyleLink system
- Customers can view order status at `/orders`
- Webhooks update order status automatically
- Integration with retailer systems for fulfillment

## Advanced Features (For Production)

### Stripe Connect for Multi-Party Payments
To split payments between StyleLink and retailers:

```javascript
// Create connected account for retailer
const account = await stripe.accounts.create({
  type: 'express',
  email: retailerEmail,
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true },
  },
});
```

### Subscription Management
For premium StyleLink features:
- Style consultations
- Premium product recommendations
- Early access to sales

### Fraud Prevention
- Stripe Radar integration
- Address verification
- 3D Secure authentication

## Business Model Benefits

1. **No Upfront Costs**: Retailers pay no fees to join
2. **Performance-Based**: StyleLink only earns when sales happen
3. **Trust & Security**: Stripe handles all payment security
4. **Global Reach**: Accept payments from worldwide customers
5. **Analytics**: Detailed sales and commission tracking

## Testing Scenarios

### Successful Payment
- Card: `4242 4242 4242 4242`
- Any future date, any CVC
- Result: Payment succeeds, order created

### Failed Payment
- Card: `4000 0000 0000 0002`
- Any future date, any CVC
- Result: Card declined

### International Card
- Card: `4000 0000 0000 3220`
- Test international payments

## Troubleshooting

### Common Issues
1. **Webhook not receiving events**: Check URL and ngrok for local testing
2. **API key errors**: Verify keys are correct in `.env.local`
3. **Payment failures**: Check Stripe logs in dashboard

### Production Checklist
- [ ] Switch to live API keys
- [ ] Update webhook URL to production domain
- [ ] Enable Stripe Connect for retailer payments
- [ ] Set up proper error monitoring
- [ ] Configure email notifications
- [ ] Test with real cards in small amounts

## Support
- Stripe Documentation: [https://stripe.com/docs](https://stripe.com/docs)
- StyleLink Team: Contact through `/contact` page
