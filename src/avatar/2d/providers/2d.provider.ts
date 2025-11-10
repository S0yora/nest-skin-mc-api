import { Injectable } from '@nestjs/common';
import { Buffer } from 'node:buffer';
import { loadImage, Image } from 'canvas';
import { SkinService } from 'src/skin/skin.service';
import { CacheUtil } from 'src/common/utils/cache.util';
import { CanvasUtil, DrawUtil } from '../utils';
import {
    IAvatar2DService,
    IAvatar2D,
    Avatar2DType,
    IDimensions,
} from '../types/avatar.types';

@Injectable()
export abstract class Avatar2DProvider implements IAvatar2DService {
    protected abstract readonly avatarType: Avatar2DType;

    constructor(
        protected readonly skinService: SkinService,
        protected readonly cacheService: CacheUtil,
        protected readonly canvasUtils: CanvasUtil,
        protected readonly draw: DrawUtil,
    ) {}

    async get(
        nickname: string,
        size: number,
        overlay: boolean,
    ): Promise<Buffer> {
        const cacheKey = this.cacheService.generateCacheKey(
            this.avatarType,
            nickname,
            overlay,
        );

        const cachedAvatar = await this.getCachedAvatar(cacheKey);
        if (cachedAvatar) {
            return this.resizeCachedAvatar(cachedAvatar, size);
        }

        const { skin, slim } = await this.skinService.getSkin(nickname);
        const img: Image = await loadImage(skin);
        const dimensions = this.canvasUtils.getDimensions(
            slim,
            this.avatarType,
        );

        const baseAvatarBuffer = this.drawAvatar(
            img,
            dimensions,
            overlay,
            slim,
        );

        await this.cacheAvatar(cacheKey, baseAvatarBuffer, slim);

        return this.canvasUtils.resizeAvatar(
            baseAvatarBuffer,
            dimensions.width,
            dimensions.height,
            size,
        );
    }

    protected abstract drawAvatar(
        img: Image,
        dimensions: IDimensions,
        overlay: boolean,
        slim: boolean,
    ): Buffer;

    private async getCachedAvatar(
        cacheKey: string,
    ): Promise<IAvatar2D | Buffer | null> {
        if (this.avatarType === 'face') {
            return await this.cacheService.get(cacheKey);
        }
        return await this.cacheService.get(cacheKey);
    }

    private async resizeCachedAvatar(
        cachedAvatar: IAvatar2D | Buffer,
        size: number,
    ): Promise<Buffer> {
        if (this.avatarType === 'face') {
            const buffer = cachedAvatar as Buffer;
            return this.canvasUtils.resizeAvatar(buffer, 8, 8, size);
        }

        const avatar = cachedAvatar as IAvatar2D;
        const dimensions = this.canvasUtils.getDimensions(
            avatar.slim,
            this.avatarType,
        );
        return this.canvasUtils.resizeAvatar(
            avatar.avatar,
            dimensions.width,
            dimensions.height,
            size,
        );
    }

    private async cacheAvatar(
        cacheKey: string,
        baseAvatarBuffer: Buffer,
        slim: boolean,
    ): Promise<void> {
        if (this.avatarType === 'face') {
            await this.cacheService.set(cacheKey, baseAvatarBuffer);
        } else {
            const cacheValue: IAvatar2D = {
                avatar: baseAvatarBuffer,
                slim,
            };
            await this.cacheService.set(cacheKey, cacheValue);
        }
    }
}
