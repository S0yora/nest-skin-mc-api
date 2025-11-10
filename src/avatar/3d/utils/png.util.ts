import { Injectable } from '@nestjs/common';
import { PNG } from 'pngjs';

@Injectable()
export class PngUtil {
    write(height: number, width: number, gl: WebGLRenderingContext) {
        const pixels = new Uint8Array(width * height * 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        const downsample = 2;
        const smoothedWidth = Math.round(width / downsample);
        const smoothedHeight = Math.round(height / downsample);

        const smoothedPixels = new Uint8Array(
            smoothedWidth * smoothedHeight * 4,
        );

        for (let y = 0; y < smoothedHeight; y++) {
            for (let x = 0; x < smoothedWidth; x++) {
                const dstIndex = (y * smoothedWidth + x) * 4;

                let r = 0,
                    g = 0,
                    b = 0,
                    a = 0;
                let sampleCount = 0;

                for (
                    let dy = 0;
                    dy < downsample && y * downsample + dy < height;
                    dy++
                ) {
                    for (
                        let dx = 0;
                        dx < downsample && x * downsample + dx < width;
                        dx++
                    ) {
                        const srcY = y * downsample + dy;
                        const srcX = x * downsample + dx;
                        const srcIndex = (srcY * width + srcX) * 4;

                        r += pixels[srcIndex];
                        g += pixels[srcIndex + 1];
                        b += pixels[srcIndex + 2];
                        a += pixels[srcIndex + 3];
                        sampleCount++;
                    }
                }

                if (sampleCount === 0) continue;

                smoothedPixels[dstIndex] = Math.round(r / sampleCount);
                smoothedPixels[dstIndex + 1] = Math.round(g / sampleCount);
                smoothedPixels[dstIndex + 2] = Math.round(b / sampleCount);
                smoothedPixels[dstIndex + 3] = Math.round(a / sampleCount);
            }
        }

        const png = new PNG({ height, width });

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const srcX = Math.round((x / width) * smoothedWidth);
                const srcY = Math.round((y / height) * smoothedHeight);
                const srcIndex = (srcY * smoothedWidth + srcX) * 4;
                const dstIndex = ((height - y - 1) * width + x) * 4;

                const r = smoothedPixels[srcIndex];
                const g = smoothedPixels[srcIndex + 1];
                const b = smoothedPixels[srcIndex + 2];
                const a = smoothedPixels[srcIndex + 3];

                const gamma = 1.0 / 2.2;
                const rCorrected = Math.pow(r / 255, gamma) * 255;
                const gCorrected = Math.pow(g / 255, gamma) * 255;
                const bCorrected = Math.pow(b / 255, gamma) * 255;

                png.data[dstIndex] = Math.round(Math.min(255, rCorrected));
                png.data[dstIndex + 1] = Math.round(Math.min(255, gCorrected));
                png.data[dstIndex + 2] = Math.round(Math.min(255, bCorrected));
                png.data[dstIndex + 3] = a;
            }
        }

        const image = PNG.sync.write(png);

        return image;
    }
}
