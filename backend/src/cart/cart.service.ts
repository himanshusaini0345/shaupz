import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CartItem {
  @Field()
  productId: string;
  
  @Field(() => Int)
  quantity: number;
}

@Injectable()
export class CartService {
  private readonly ttlSeconds = 60 * 60 * 24;

  constructor(private readonly redisService: RedisService) {}

  private key(sessionId: string) {
    return `cart:${sessionId}`;
  }

  async getCart(sessionId: string): Promise<CartItem[]> {
    return (await this.redisService.get<CartItem[]>(this.key(sessionId))) || [];
  }

  async addToCart(sessionId: string, productId: string, quantity: number) {
    const cart = await this.getCart(sessionId);
    const existing = cart.find((item) => item.productId === productId);
    if (existing) existing.quantity += quantity;
    else cart.push({ productId, quantity });
    await this.redisService.set(this.key(sessionId), cart, this.ttlSeconds);
    return cart;
  }

  async removeFromCart(sessionId: string, productId: string) {
    const cart = await this.getCart(sessionId);
    const updated = cart.filter((item) => item.productId !== productId);
    await this.redisService.set(this.key(sessionId), updated, this.ttlSeconds);
    return updated;
  }

  async clearCart(sessionId: string) {
    await this.redisService.del(this.key(sessionId));
  }
}
