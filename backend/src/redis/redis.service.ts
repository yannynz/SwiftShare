import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://redis:6379',
    });
    await this.client.connect();
  }
  async onModuleDestroy() {
    await this.client.disconnect();
  }

  set(key: string, value: string, ttlSeconds: number) {
    return this.client.set(key, value, { EX: ttlSeconds });
  }
}

