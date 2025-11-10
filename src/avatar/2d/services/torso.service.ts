import { Injectable } from '@nestjs/common';
import { Buffer } from 'node:buffer';
import { Image } from 'canvas';
import { SkinService } from 'src/skin/skin.service';
import { Avatar2DProvider } from '../providers/2d.provider';
import { IDimensions } from '../types/avatar.types';
import { CanvasUtil, DrawUtil } from '../utils';
import { CacheUtil } from 'src/common/utils/cache.util';

@Injectable()
export class TorsoAvatar2DService extends Avatar2DProvider {
    protected readonly avatarType = 'torso';

    constructor(
        skinService: SkinService,
        cacheService: CacheUtil,
        canvas: CanvasUtil,
        draw: DrawUtil,
    ) {
        super(skinService, cacheService, canvas, draw);
    }

    protected drawAvatar(
        img: Image,
        dimensions: IDimensions,
        overlay: boolean,
        slim: boolean,
    ): Buffer {
        const { canvas, ctx } = this.canvasUtils.createCanvas(
            dimensions.width,
            dimensions.height,
        );

        this.draw.face(ctx, img, overlay, slim);
        this.draw.body(ctx, img, overlay, slim);
        this.draw.leftArm(ctx, img, overlay, slim);
        this.draw.rightArm(ctx, img, overlay, slim);

        return canvas.toBuffer('image/png');
    }
}
