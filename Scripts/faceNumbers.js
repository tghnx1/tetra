import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import { scene } from './scene.js';

export function addFaceNumbers(vertices, faces) {
    // Calculate center of each face
    const faceCenters = faces.map(face => {
        const v0 = vertices[face[0]];
        const v1 = vertices[face[1]];
        const v2 = vertices[face[2]];
        return new THREE.Vector3()
            .add(v0)
            .add(v1)
            .add(v2)
            .divideScalar(3);
    });

    // Helper to create a sprite with a number
    function createNumberSprite(number) {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0,0,0,0.0)';
        ctx.fillRect(0, 0, size, size);
        ctx.font = 'bold 64px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 6;
        ctx.strokeText(number, size / 2, size / 2);
        ctx.fillText(number, size / 2, size / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(0.7, 0.7, 0.7);
        return sprite;
    }

    // Add a sprite to each face center
    faceCenters.forEach((center, i) => {
        const sprite = createNumberSprite(i + 1);
        sprite.position.copy(center);
        scene.add(sprite);
    });
}