import * as THREE from 'three';
import { Injectable } from '@nestjs/common';
import { Buffer } from 'node:buffer';
import { loadGltf } from 'node-three-gltf';
import { SkinService } from 'src/skin/skin.service';
import { PngUtil, RendererUtil, FxxaUtil } from '../utils';
import { Avatar3DProvider } from '../providers/3d.provider';
import { CacheUtil } from 'src/common/utils/cache.util';

@Injectable()
export class ChibiAvatar3DService extends Avatar3DProvider {
    protected readonly avatarType = 'chibi' as const;

    constructor(
        skinService: SkinService,
        cacheService: CacheUtil,
        rendererUtil: RendererUtil,
        pngUtil: PngUtil,
        fxxaUtil: FxxaUtil,
    ) {
        super(skinService, cacheService, rendererUtil, pngUtil, fxxaUtil);
    }

    async renderAvatar(nickname: string, size: number): Promise<Buffer> {
        const width = size;
        const height = size;

        const { renderer, gl } = this.rendererUtil.getRenderer(width, height);

        const camera = new THREE.PerspectiveCamera(10, width / height, 1);
        camera.position.x = 0;
        camera.position.y = 0.375;
        camera.position.z = -5.5;
        camera.lookAt(0, 0.375, 0);
        const scene = this.createScene();

        const pLight = new THREE.PointLight(0xffffff, 22);
        pLight.position.set(0, 3, -7);
        scene.add(pLight);

        const { skin, slim } = await this.skinService.getSkin(nickname);
        const gltf = await loadGltf(
            `assets/models/chibi/chibi-${slim ? 'slim' : 'classic'}.gltf`,
        );

        const texture = await this.loadTexture(skin);
        this.applyTextureToScene(gltf.scene, texture);

        scene.add(gltf.scene);

        const renderTarget = this.getOrCreateRenderTarget(width, height);

        renderer.setRenderTarget(renderTarget);
        renderer.render(scene, camera);
        renderer.setRenderTarget(null);

        this.fxxaUtil.render(height, width, renderTarget, renderer);

        this.disposeScene(scene);

        this.handleError(gl);

        return this.pngUtil.write(height, width, gl);
    }
}
