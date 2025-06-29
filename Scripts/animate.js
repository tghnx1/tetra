import { tetrahedron } from './tetrahedron.js';
import { isDragging } from './controls.js'; // Import the isDragging state


let blinkTime = 0;

const faces = [
    [0, 1, 2],
    [0, 2, 3],
    [0, 3, 1],
    [1, 3, 2],
];

function getFaceNormal(face) {
    const pos = tetrahedron.geometry.attributes.position;
    const a = new THREE.Vector3().fromArray(pos.array, face[0] * 3);
    const b = new THREE.Vector3().fromArray(pos.array, face[1] * 3);
    const c = new THREE.Vector3().fromArray(pos.array, face[2] * 3);
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
        for (let i = 0; i < faces.length; i++) {
            const normal = getFaceNormal(faces[i]);
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