import { Injectable } from '@nestjs/common';
import { Buffer } from 'node:buffer';
import { Image } from 'canvas';
import { SkinService } from 'src/skin/skin.service';
import { DrawUtil, CanvasUtil } from '../utils';
import { Avatar2DProvider } from '../providers/2d.provider';
import { IDimensions } from '../types/avatar.types';
import { CacheUtil } from 'src/common/utils/cache.util';

@Injectable()
export class FaceAvatar2DService extends Avatar2DProvider {
    protected readonly avatarType = 'face';

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
        _dimensions: IDimensions,
        overlay: boolean,
        _slim: boolean,
    ): Buffer {
        const { canvas, ctx } = this.canvasUtils.createCanvas(8, 8);

        this.draw.face(ctx, img, overlay);

        return canvas.toBuffer('image/png');
    }
}
