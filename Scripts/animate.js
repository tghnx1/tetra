// Scripts/animate.js
import { tetrahedron } from './tetrahedron.js';
import { isDragging } from './controls.js';

let blinkTime = 0;

function getFaceNormal(faceIdx) {
    const pos = tetrahedron.geometry.attributes.position;
    const i0 = faceIdx * 3;
    const a = new THREE.Vector3().fromArray(pos.array, i0 * 3);
    const b = new THREE.Vector3().fromArray(pos.array, (i0 + 1) * 3);
    const c = new THREE.Vector3().fromArray(pos.array, (i0 + 2) * 3);
    const cb = new THREE.Vector3().subVectors(c, b);
    const ab = new THREE.Vector3().subVectors(a, b);
    const normal = new THREE.Vector3().crossVectors(cb, ab).normalize();
    normal.applyQuaternion(tetrahedron.quaternion);
    return normal;
}

function animate(renderer, scene, camera) {
    if (!isDragging) {
        blinkTime += 0.15;
        const pulse = (Math.sin(blinkTime + Math.PI / 2) + 1) / 2;
        const color = new THREE.Color().lerpColors(
            new THREE.Color(0x000000),
            new THREE.Color(0x222244),
            pulse
        );
        const camDir = new THREE.Vector3();
        camera.getWorldDirection(camDir).negate();
        let maxDot = -Infinity, closestFace = 0;
        for (let i = 0; i < 4; i++) {
            const normal = getFaceNormal(i);
            const dot = normal.dot(camDir);
            if (dot > maxDot) {
                maxDot = dot;
                closestFace = i;
            }
        }
        tetrahedron.material.forEach((mat, idx) => {
            if (idx === closestFace) mat.emissive.copy(color);
            else mat.emissive.set(0x000000);
        });
        tetrahedron.rotation.x += 0.003;
        tetrahedron.rotation.y += 0.003;
    } else {
        tetrahedron.material.forEach(mat => mat.emissive.set(0x000000));
    }
    renderer.render(scene, camera);
}

export { animate };