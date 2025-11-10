import GL from 'gl';
import * as THREE from 'three';
import { Injectable, OnModuleDestroy } from '@nestjs/common';

const MAX_SIZE = 1024;

@Injectable()
export class RendererUtil implements OnModuleDestroy {
    private gl: (WebGLRenderingContext & GL.StackGLExtension) | null = null;
    private renderer: THREE.WebGLRenderer | null = null;
    private canvas: any | null = null;

    getRenderer(width: number, height: number) {
        if (!this.renderer || !this.gl) {
            this.gl = GL(MAX_SIZE, MAX_SIZE);

            this.canvas = {
                width: MAX_SIZE,
                height: MAX_SIZE,
                style: {},
                clientWidth: MAX_SIZE,
                clientHeight: MAX_SIZE,
                addEventListener: () => null,
                removeEventListener: () => null,
                getContext: (contextType: string) => {
                    if (
                        contextType === 'webgl' ||
                        contextType === 'webgl2' ||
                        contextType === 'experimental-webgl'
                    ) {
                        return this.gl;
                    }
                    return null;
                },
            };

            this.renderer = new THREE.WebGLRenderer({
                context: this.gl,
                canvas: this.canvas,
                alpha: true,
                antialias: false,
            });
        }

        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
            this.renderer.setSize(width, height, false);
        }

        return { renderer: this.renderer, gl: this.gl };
    }

    onModuleDestroy() {
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        if (this.gl) this.gl = null;
        this.canvas = null;
    }
}
