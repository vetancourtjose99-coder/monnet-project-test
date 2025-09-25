import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';

@Injectable()
export class IdempotencyService {
  private readonly logger = new Logger(IdempotencyService.name);
  private readonly ttl: number;

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private config: ConfigService,
  ) {
    this.ttl = this.config.get('IDEMPOTENCY_TTL', 3600) * 1000;
  }

  async get<T = any>(key: string): Promise<T | undefined> {
    try {
      return await this.cache.get<T>(this.getKey(key));
    } catch (error) {
      this.logger.error(`Failed to get idempotency key ${key}:`, error);
      return undefined;
    }
  }

  async set<T = any>(key: string, value: T): Promise<void> {
    try {
      await this.cache.set(this.getKey(key), value, this.ttl);
    } catch (error) {
      this.logger.error(`Failed to set idempotency key ${key}:`, error);
    }
  }

  private getKey(key: string): string {
    return `idempotency:${key}`;
  }
}