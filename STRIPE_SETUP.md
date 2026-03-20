# Stripe Payment Integration Setup

## Overview
The payment system now uses real Stripe integration for secure payment processing.

## Setup Instructions

### 1. Create a Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a free account
3. You'll start in **Test Mode** (perfect for development)

### 2. Get Your API Keys
1. Log in to your Stripe Dashboard
2. Go to **Developers** → **API keys**
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`) - Click to reveal

### 3. Configure Backend Environment Variables
1. Copy `.env.example` to `.env` in `/apps/backend/`
2. Add your Stripe Secret Key:
   ```
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
   ```

### 4. Configure Frontend Environment Variables
1. Create `.env.local` file in `/frontend/`
2. Add your Stripe Publishable Key:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
   ```

### 5. Test the Payment System
1. Start the backend server:
   ```bash
   cd apps/backend
   pnpm run start:dev
   ```

2. Start the frontend server:
   ```bash
   cd frontend
   pnpm run dev
   ```

3. Navigate to the payment page and test with Stripe's test cards:
   - **Success**: `4242 4242 4242 4242`
   - **Requires authentication**: `4000 0025 0000 3155`
   - **Declined**: `4000 0000 0000 9995`
   - Use any future expiry date (e.g., `12/34`)
   - Use any 3-digit CVC (e.g., `123`)
   - Use any ZIP code (e.g., `12345`)

### 6. How It Works

#### Backend Flow:
1. `PaymentService` initializes Stripe with your secret key
2. `createPaymentIntent()` creates a secure payment session
3. Returns a `clientSecret` to the frontend

#### Frontend Flow:
1. `PaymentPage` loads order details from localStorage
2. Calls backend to create a payment intent
3. Stripe Elements component renders secure payment form
4. On successful payment, redirects to dashboard

### 7. Stripe Elements Features
- **Real payment form** with built-in validation
- **Automatic card brand detection** (Visa, Mastercard, Amex, etc.)
- **3D Secure support** for added security
- **Mobile-optimized** input fields
- **PCI compliance** - card data never touches your servers

### 8. Production Deployment
When ready for production:
1. Complete Stripe account verification
2. Switch to **Live Mode** in Stripe Dashboard
3. Get your live API keys (start with `pk_live_...` and `sk_live_...`)
4. Update environment variables with live keys
5. Test thoroughly with real cards (small amounts)

### 9. Webhook Setup (Optional but Recommended)
For handling async payment events:
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Add endpoint: `https://yourdomain.com/webhook/stripe`
3. Select events to listen for (e.g., `payment_intent.succeeded`)
4. Add webhook secret to backend `.env`

## API Endpoints

### POST `/payment/create-payment-intent`
Creates a payment intent for one-time payments.

**Request:**
```json
{
  "amount": 2249.00,
  "currency": "usd"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### POST `/payment/create-customer`
Creates a Stripe customer.

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

### POST `/payment/create-subscription`
Creates a subscription for recurring payments.

**Request:**
```json
{
  "customerId": "cus_xxx",
  "priceId": "price_xxx",
  "paymentMethodId": "pm_xxx"
}
```

## Security Best Practices
✅ Secret keys are server-side only  
✅ Publishable keys are safe for client-side  
✅ Never commit API keys to Git  
✅ Use environment variables for all keys  
✅ Test mode keys can't process real charges  
✅ Card data is handled entirely by Stripe  

## Support
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Test Cards](https://stripe.com/docs/testing)
