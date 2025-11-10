import { CanvasRenderingContext2D, Image, Canvas } from 'canvas';

export type Avatar2DType = 'face' | 'bust' | 'torso' | 'body';

export interface IAvatar2D {
    avatar: Buffer;
    slim: boolean;
}

export interface IDimensions {
    width: number;
    height: number;
}

export interface IAvatar2DService {
    get(nickname: string, size: number, overlay: boolean): Promise<Buffer>;
}

export interface IDrawUtil {
    face(
        ctx: CanvasRenderingContext2D,
        img: Image,
        overlay: boolean,
        slim?: boolean,
    ): void;
    body(
        ctx: CanvasRenderingContext2D,
        img: Image,
        overlay: boolean,
        slim: boolean,
        bust?: boolean,
    ): void;
    leftArm(
        ctx: CanvasRenderingContext2D,
        img: Image,
        overlay: boolean,
        slim: boolean,
        bust?: boolean,
    ): void;
    rightArm(
        ctx: CanvasRenderingContext2D,
        img: Image,
        overlay: boolean,
        slim: boolean,
        bust?: boolean,
    ): void;
    leftLeg(
        ctx: CanvasRenderingContext2D,
        img: Image,
        overlay: boolean,
        slim: boolean,
    ): void;
    rightLeg(
        ctx: CanvasRenderingContext2D,
        img: Image,
        overlay: boolean,
        slim: boolean,
    ): void;
}

export interface ICanvasUtil {
    createCanvas(
        width: number,
        height: number,
    ): {
        canvas: Canvas;
        ctx: CanvasRenderingContext2D;
    };
    resizeAvatar(
        avatar: Buffer,
        width: number,
        height: number,
        size: number,
    ): Promise<Buffer>;
    getDimensions(slim: boolean, avatar: Avatar2DType): IDimensions;
}

export interface IDrawConfig {
    headSize: number;
    bodyWidth: number;
    bodyHeight: number;
    legWidth: number;
    legHeight: number;
    armHeight: number;
}

export interface IAvatar2DCacheKey {
    type: Avatar2DType;
    nickname: string;
    overlay: boolean;
}
