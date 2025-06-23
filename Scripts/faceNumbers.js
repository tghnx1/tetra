import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import { scene } from './scene.js';

export function addFaceNumbers(vertices, faces) {
    faces.forEach((face) => {
        const v0 = vertices[face[0]];
        const v1 = vertices[face[1]];
        const v2 = vertices[face[2]];

        const center = new THREE.Vector3()
            .add(v0)
            .add(v1)
            .add(v2)
            .divideScalar(3);

        const edge1 = new THREE.Vector3().subVectors(v1, v0);
        const edge2 = new THREE.Vector3().subVectors(v2, v0);
        const normal = new THREE.Vector3().crossVectors(edge1, edge2).normalize();

        const offset = 0.3;
        const labelPos = new THREE.Vector3().copy(center).addScaledVector(normal, offset);

        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, size, size);
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 8;
        ctx.strokeText('test', size / 2, size / 2);
        ctx.fillText('test', size / 2, size / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(1, 0.4, 1); // Wider for text

        sprite.position.copy(labelPos);
        scene.add(sprite);
    });
}