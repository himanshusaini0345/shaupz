import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class IdempotencyService {
  private readonly ttlSeconds = 60 * 15;

  constructor(private readonly redisService: RedisService) {}

  private key(value: string) {
    return `idem:${value}`;
  }

  async getStoredResponse(key: string) {
    return this.redisService.get(this.key(key));
  }

  async reserve(key: string) {
    return this.redisService.client.set(this.key(key), JSON.stringify({ status: 'processing' }), 'EX', this.ttlSeconds, 'NX');
  }

  async storeResponse(key: string, response: unknown) {
    await this.redisService.set(this.key(key), { status: 'completed', response }, this.ttlSeconds);
  }
}
