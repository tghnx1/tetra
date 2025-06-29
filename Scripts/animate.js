import { tetrahedron } from './tetrahedron.js';
import { isDragging } from './controls.js'; // Import the isDragging state

function animate(renderer, scene, camera) {
    // Rotate only if no dragging is happening
    if (!isDragging) {
        tetrahedron.material.forEach(mat => mat.emissive.set(0x222244)); // subtle glow
        tetrahedron.rotation.x += 0.003; // Adjust rotation speed on the X-axis
        tetrahedron.rotation.y += 0.003; // Adjust rotation speed on the Y-axis
    }
    else
        tetrahedron.material.forEach(mat => mat.emissive.set(0x000000));

    renderer.render(scene, camera); // Render the scene from the perspective of the camera
}

export { animate };