import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CheckoutService } from './checkout.service';
import { IdempotencyGuard } from '../idempotency/idempotency.guard';
import { IdempotencyService } from '../idempotency/idempotency.service';

@Controller()
export class CheckoutController {
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly idempotencyService: IdempotencyService
  ) {}

  @UseGuards(IdempotencyGuard)
  @Post('checkout')
  async checkout(@Req() req: Request & { idempotentResponse?: unknown }) {
    if (req.idempotentResponse) return req.idempotentResponse;

    const sessionId = req.headers['x-session-id']?.toString() || 'guest-session';
    const key = req.headers['idempotency-key']!.toString();
    const response = await this.checkoutService.checkout(sessionId);
    await this.idempotencyService.storeResponse(key, response);
    return response;
  }
}
