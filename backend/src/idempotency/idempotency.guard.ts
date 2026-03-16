import { CanActivate, ExecutionContext, Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { Request } from 'express';
import { IdempotencyService } from './idempotency.service';

@Injectable()
export class IdempotencyGuard implements CanActivate {
  constructor(private readonly idempotencyService: IdempotencyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { idempotentResponse?: unknown }>();
    const key = req.headers['idempotency-key']?.toString();

    if (!key) throw new BadRequestException('Idempotency-Key header is required');

    const existing = await this.idempotencyService.getStoredResponse(key);
    if (existing && (existing as any).status === 'completed') {
      req.idempotentResponse = (existing as any).response;
      return true;
    }

    const lock = await this.idempotencyService.reserve(key);
    if (!lock) throw new ConflictException('Duplicate request is in progress');

    return true;
  }
}
