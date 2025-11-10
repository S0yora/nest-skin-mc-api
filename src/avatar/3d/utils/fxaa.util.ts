import * as THREE from 'three';
import fs from 'fs';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class FxxaUtil implements OnModuleInit {
    private fxaaVertexShader: string;
    private fxaaFragmentShader: string;
    private fxaaGeometry: THREE.PlaneGeometry;
    private fxaaCamera: THREE.OrthographicCamera;
    private fxaaScene: THREE.Scene;

    onModuleInit() {
        this.fxaaVertexShader = fs.readFileSync(
            'assets/shaders/fxaa/fxaa.vert',
            'utf8',
        );
        this.fxaaFragmentShader = fs.readFileSync(
            'assets/shaders/fxaa/fxaa.frag',
            'utf8',
        );
        this.fxaaGeometry = new THREE.PlaneGeometry(2, 2);
        this.fxaaCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.fxaaScene = new THREE.Scene();
    }

    render(
        height: number,
        width: number,
        renderTarget: THREE.WebGLRenderTarget<THREE.Texture>,
        renderer: THREE.WebGLRenderer,
    ) {
        const fxaaMaterial = new THREE.ShaderMaterial({
            vertexShader: this.fxaaVertexShader,
            fragmentShader: this.fxaaFragmentShader,
            uniforms: {
                resolution: { value: new THREE.Vector2(width, height) },
                dataTexture: { value: renderTarget.texture },
            },
            transparent: true,
            depthWrite: false,
        });

        const fxaaMesh = new THREE.Mesh(this.fxaaGeometry, fxaaMaterial);
        this.fxaaScene.add(fxaaMesh);

        renderer.render(this.fxaaScene, this.fxaaCamera);

        this.fxaaScene.remove(fxaaMesh);
        fxaaMaterial.dispose();
    }
}
