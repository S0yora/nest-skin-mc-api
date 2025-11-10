import { Injectable } from '@nestjs/common';
import {
    createCanvas,
    loadImage,
    Canvas,
    CanvasRenderingContext2D,
    Image,
} from 'canvas';
import { ICanvasUtil, IDimensions, Avatar2DType } from '../types';

@Injectable()
export class CanvasUtil implements ICanvasUtil {
    createCanvas(
        width: number,
        height: number,
    ): {
        canvas: Canvas;
        ctx: CanvasRenderingContext2D;
    } {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        return { canvas, ctx };
    }

    async resizeAvatar(
        avatar: Buffer,
        width: number,
        height: number,
        size: number,
    ): Promise<Buffer> {
        const newHeight = (height * size) / width;
        const { canvas, ctx } = this.createCanvas(size, newHeight);

        const img: Image = await loadImage(avatar);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        return canvas.toBuffer('image/png');
    }

    getDimensions(slim: boolean, avatar: Avatar2DType): IDimensions {
        const heightMap: Record<Avatar2DType, number> = {
            face: 8,
            bust: 16,
            torso: 20,
            body: 32,
        };

        const defaultWidth = slim ? 14 : 16;
        const width = avatar === 'face' ? 8 : defaultWidth;

        return {
            width: width,
            height: heightMap[avatar],
        };
    }
}
