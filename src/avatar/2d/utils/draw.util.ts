import { Injectable } from '@nestjs/common';
import { CanvasRenderingContext2D, Image } from 'canvas';
import { IDrawUtil, IDrawConfig } from '../types';

const config: IDrawConfig = {
    headSize: 8,
    bodyWidth: 8,
    bodyHeight: 12,
    legWidth: 4,
    legHeight: 12,
    armHeight: 12,
};

@Injectable()
export class DrawUtil implements IDrawUtil {
    face(
        ctx: CanvasRenderingContext2D,
        img: Image,
        overlay: boolean,
        slim?: boolean,
    ): void {
        const x = typeof slim === 'undefined' ? 0 : this.getIsArmWidth(slim);
        const y = 0;
        const size = config.headSize;

        ctx.drawImage(img, 8, 8, size, size, x, y, size, size);
        if (overlay) ctx.drawImage(img, 40, 8, size, size, x, y, size, size);
    }

    body(
        ctx: CanvasRenderingContext2D,
        img: Image,
        overlay: boolean,
        slim: boolean,
        bust: boolean = false,
    ): void {
        const armWidth = this.getIsArmWidth(slim);
        const x = armWidth;
        const y = config.headSize;
        const width = config.bodyWidth;
        const height = bust ? config.bodyHeight - 4 : config.bodyHeight;

        ctx.drawImage(img, 20, 20, width, height, x, y, width, height);
        if (overlay)
            ctx.drawImage(img, 20, 36, width, height, x, y, width, height);
    }

    leftArm(
        ctx: CanvasRenderingContext2D,
        img: Image,
        overlay: boolean,
        slim: boolean,
        bust: boolean = false,
    ): void {
        const armWidth = this.getIsArmWidth(slim);
        const x = 0;
        const y = config.headSize;
        const width = armWidth;
        const height = bust ? config.armHeight - 4 : config.armHeight;

        ctx.drawImage(img, 44, 20, width, height, x, y, width, height);
        if (overlay)
            ctx.drawImage(img, 44, 36, width, height, x, y, width, height);
    }

    rightArm(
        ctx: CanvasRenderingContext2D,
        img: Image,
        overlay: boolean,
        slim: boolean,
        bust: boolean = false,
    ): void {
        const armWidth = this.getIsArmWidth(slim);
        const x = armWidth + config.bodyWidth;
        const y = config.headSize;
        const width = armWidth;
        const height = bust ? config.armHeight - 4 : config.armHeight;

        ctx.drawImage(img, 36, 52, width, height, x, y, width, height);
        if (overlay)
            ctx.drawImage(img, 52, 52, width, height, x, y, width, height);
    }

    leftLeg(
        ctx: CanvasRenderingContext2D,
        img: Image,
        overlay: boolean,
        slim: boolean,
    ): void {
        const armWidth = this.getIsArmWidth(slim);
        const x = armWidth;
        const y = config.headSize + config.bodyHeight;
        const width = config.legWidth;
        const height = config.legHeight;

        ctx.drawImage(img, 4, 20, width, height, x, y, width, height);
        if (overlay)
            ctx.drawImage(img, 4, 36, width, height, x, y, width, height);
    }

    rightLeg(
        ctx: CanvasRenderingContext2D,
        img: Image,
        overlay: boolean,
        slim: boolean,
    ): void {
        const armWidth = this.getIsArmWidth(slim);
        const x = armWidth + config.bodyWidth / 2;
        const y = config.headSize + config.bodyHeight;
        const width = config.legWidth;
        const height = config.legHeight;

        ctx.drawImage(img, 20, 52, width, height, x, y, width, height);
        if (overlay)
            ctx.drawImage(img, 4, 52, width, height, x, y, width, height);
    }

    private getIsArmWidth(slim: boolean): 3 | 4 {
        return slim ? 3 : 4;
    }
}
