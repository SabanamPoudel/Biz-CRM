import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { amount: number; currency?: string }) {
    return this.paymentService.createPaymentIntent(body.amount, body.currency);
  }

  @Post('create-customer')
  async createCustomer(@Body() body: { email: string; name?: string }) {
    return this.paymentService.createCustomer(body.email, body.name);
  }

  @Post('create-subscription')
  async createSubscription(
    @Body()
    body: {
      customerId: string;
      priceId: string;
      paymentMethodId: string;
    },
  ) {
    return this.paymentService.createSubscription(
      body.customerId,
      body.priceId,
      body.paymentMethodId,
    );
  }

  @Get('payment-intent/:id')
  async getPaymentIntent(@Param('id') id: string) {
    return this.paymentService.getPaymentIntent(id);
  }
}
