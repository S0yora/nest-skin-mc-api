import * as THREE from 'three';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Buffer } from 'node:buffer';
import { TextureLoader } from 'node-three-gltf';
import { SkinService } from 'src/skin/skin.service';
import { CacheUtil } from 'src/common/utils/cache.util';
import { FxxaUtil, PngUtil, RendererUtil } from '../utils';
import { IAvatar3DService, Avatar3DType } from '../types/avatar.types';

export interface MaterialConfig {
    colorMultiplier?: number;
    emissiveColor?: number;
    emissiveIntensity?: number;
}

@Injectable()
export abstract class Avatar3DProvider
    implements IAvatar3DService, OnModuleDestroy
{
    protected abstract readonly avatarType: Avatar3DType;

    private readonly renderTargetPool: Map<string, THREE.WebGLRenderTarget> =
        new Map();
    private readonly defaultMaterialConfig: MaterialConfig = {
        colorMultiplier: 1.2,
        emissiveColor: 0xf0f3ff,
        emissiveIntensity: 0.02,
    };

    constructor(
        protected readonly skinService: SkinService,
        protected readonly cacheService: CacheUtil,
        protected readonly rendererUtil: RendererUtil,
        protected readonly pngUtil: PngUtil,
        protected readonly fxxaUtil: FxxaUtil,
    ) {}

    async get(nickname: string, size: number): Promise<Buffer> {
        const baseCacheKey = this.cacheService.generateCacheKey(
            this.avatarType,
            nickname,
        );
        const cacheKey = `${baseCacheKey}:${size}`;

        const cachedAvatar = await this.cacheService.get<Buffer>(cacheKey);
        if (cachedAvatar) {
            return cachedAvatar;
        }

        const avatarBuffer = await this.renderAvatar(nickname, size);
        await this.cacheService.set(cacheKey, avatarBuffer);

        return avatarBuffer;
    }

    handleError(gl: WebGLRenderingContext) {
        const error = gl.getError();
        if (error !== gl.NO_ERROR) console.error('WebGL Error:', error);
    }

    protected createScene(): THREE.Scene {
        const scene = new THREE.Scene();
        scene.background = null;
        return scene;
    }

    protected async loadTexture(skin: Buffer): Promise<THREE.Texture> {
        const url = URL.createObjectURL(
            new Blob([skin as any], { type: 'image/png' }),
        );
        try {
            const texture = await new TextureLoader().loadAsync(url);
            URL.revokeObjectURL(url);
            return texture;
        } catch (error) {
            URL.revokeObjectURL(url);
            throw error;
        }
    }

    protected applyTextureToScene(
        scene: THREE.Object3D,
        texture: THREE.Texture,
        config: MaterialConfig = {},
    ): void {
        const materialConfig = { ...this.defaultMaterialConfig, ...config };

        scene.traverse((mesh: any) => {
            if (typeof mesh.material === 'object') {
                mesh.material.map.source = texture.source;
                mesh.material.map.colorSpace = THREE.SRGBColorSpace;
                mesh.material.map.flipY = false;

                if (mesh.material.color && materialConfig.colorMultiplier) {
                    mesh.material.color.multiplyScalar(
                        materialConfig.colorMultiplier,
                    );
                }

                if (materialConfig.emissiveColor !== undefined) {
                    mesh.material.emissive = new THREE.Color(
                        materialConfig.emissiveColor,
                    );
                }

                if (materialConfig.emissiveIntensity !== undefined) {
                    mesh.material.emissiveIntensity =
                        materialConfig.emissiveIntensity;
                }

                mesh.material.needsUpdate = true;
            }
        });
    }

    protected getOrCreateRenderTarget(
        width: number,
        height: number,
    ): THREE.WebGLRenderTarget {
        const key = `${width}x${height}`;
        let renderTarget = this.renderTargetPool.get(key);

        if (!renderTarget) {
            renderTarget = new THREE.WebGLRenderTarget(width, height, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                generateMipmaps: false,
                colorSpace: THREE.SRGBColorSpace,
            });
            this.renderTargetPool.set(key, renderTarget);
        }

        return renderTarget;
    }

    protected disposeScene(scene: THREE.Scene) {
        scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach((mat) => {
                            if (mat.map) mat.map.dispose();
                            mat.dispose();
                        });
                    } else {
                        if (object.material.map) {
                            object.material.map.dispose();
                        }
                        object.material.dispose();
                    }
                }
            }
        });
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
    }

    onModuleDestroy() {
        for (const renderTarget of this.renderTargetPool.values()) {
            renderTarget.dispose();
        }
        this.renderTargetPool.clear();
    }

    protected abstract renderAvatar(
        nickname: string,
        size: number,
    ): Promise<Buffer>;
}
