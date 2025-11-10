import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { IAvatar2D } from '../../avatar/2d/types/avatar.types';

@Injectable()
export class CacheUtil {
    private readonly logger = new Logger(CacheUtil.name);

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    generateCacheKey(
        type: string,
        nickname: string,
        overlay: boolean = true,
    ): string {
        return overlay
            ? `${type}:${nickname}`
            : `${type}:${nickname}:without_overlay`;
    }

    async get<T>(cacheKey: string): Promise<T | null> {
        try {
            const result = await this.cacheManager.get<T>(cacheKey);
            return result ?? null;
        } catch (error) {
            this.logger.error(`Cache get error for key ${cacheKey}:`, error);
            return null;
        }
    }

    async set(cacheKey: string, value: any, ttl?: number): Promise<void> {
        try {
            await this.cacheManager.set(cacheKey, value, ttl);
        } catch (error) {
            this.logger.error(`Cache set error for key ${cacheKey}:`, error);
        }
    }
}
