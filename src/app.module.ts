import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { AvatarModule } from './avatar/avatar.module';
import { SkinModule } from './skin/skin.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async (configService: ConfigService) => {
                const redisUrl = configService.get<string>('REDIS_URL');

                if (!redisUrl) console.error('REDIS_URL undefined in .env');

                return {
                    stores: [
                        new KeyvRedis(redisUrl),
                        new Keyv({
                            store: new CacheableMemory({
                                ttl: 86400,
                                lruSize: 2500,
                            }),
                        }),
                    ],
                };
            },
            inject: [ConfigService],
        }),
        SkinModule,
        AvatarModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
