import { Body, Controller, Post, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { Request } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async add(@Req() req: Request, @Body() body: { productId: string; quantity: number }) {
    const sessionId = req.headers['x-session-id']?.toString() || 'guest-session';
    return this.cartService.addToCart(sessionId, body.productId, body.quantity || 1);
  }

  @Post('remove')
  async remove(@Req() req: Request, @Body() body: { productId: string }) {
    const sessionId = req.headers['x-session-id']?.toString() || 'guest-session';
    return this.cartService.removeFromCart(sessionId, body.productId);
  }
}
