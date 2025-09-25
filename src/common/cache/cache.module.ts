import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const redisUrl = config.get('REDIS_URL');
        
        if (redisUrl) {
          try {
            const { Keyv } = await import('keyv');
            const KeyvRedis = (await import('@keyv/redis')).default;
            
            return {
              store: new Keyv({
                store: new KeyvRedis(redisUrl),
                ttl: config.get('CACHE_TTL', 3600) * 1000,
              }),
            };
          } catch (error) {
            console.warn('Redis connection failed, falling back to memory cache:', error.message);
          }
        }
        
        return {
          ttl: config.get('CACHE_TTL', 3600) * 1000,
          max: config.get('CACHE_MAX_ITEMS', 1000),
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}