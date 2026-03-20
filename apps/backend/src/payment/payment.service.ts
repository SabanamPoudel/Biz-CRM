import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private useMockPayments: boolean;

  constructor() {
    // Check if we have a valid Stripe key
    const stripeKey = process.env.STRIPE_SECRET_KEY || '';
    this.useMockPayments = !stripeKey || stripeKey.includes('your_stripe') || stripeKey.length < 50;

    if (!this.useMockPayments) {
      try {
        // Initialize Stripe with your secret key
        this.stripe = new Stripe(stripeKey, {
          apiVersion: '2025-10-29.clover',
        });
      } catch (error) {
        console.warn('Failed to initialize Stripe, using mock payments:', error.message);
        this.useMockPayments = true;
      }
    }

    if (this.useMockPayments) {
      console.log('⚠️  Using MOCK PAYMENT MODE - No real Stripe integration');
      console.log('💡 To enable real payments, add your Stripe secret key to .env');
    }
  }

  async createPaymentIntent(amount: number, currency: string = 'usd') {
    if (this.useMockPayments) {
      // Return a mock client secret for testing
      const mockSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;
      console.log('🎭 Mock payment intent created for amount:', amount);
      return {
        clientSecret: mockSecret,
        paymentIntentId: `pi_mock_${Date.now()}`,
      };
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amount in cents
        currency,
        payment_method_types: ['card'], // Explicitly specify card payments
        automatic_payment_methods: {
          enabled: false, // Disable to have more control
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      throw new Error(`Payment intent creation failed: ${error.message}`);
    }
  }

  async createSubscription(
    customerId: string,
    priceId: string,
    paymentMethodId: string,
  ) {
    try {
      // Attach payment method to customer
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // Set as default payment method
      await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Create subscription
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      return subscription;
    } catch (error) {
      throw new Error(`Subscription creation failed: ${error.message}`);
    }
  }

  async createCustomer(email: string, name?: string) {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
      });

      return customer;
    } catch (error) {
      throw new Error(`Customer creation failed: ${error.message}`);
    }
  }

  async getPaymentIntent(paymentIntentId: string) {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      throw new Error(`Failed to retrieve payment intent: ${error.message}`);
    }
  }
}
