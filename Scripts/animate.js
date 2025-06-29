import { tetrahedron } from './tetrahedron.js';
import { isDragging } from './controls.js'; // Import the isDragging state


let blinkTime = 0;

function animate(renderer, scene, camera) {
    // Rotate only if no dragging is happening
    if (!isDragging) {
        blinkTime += 0.05; // Adjust speed as needed
        // Calculate pulse (0 to 1)
        const pulse = (Math.sin(blinkTime) + 1) / 2;
        // Interpolate between black and blue
        const color = new THREE.Color().lerpColors(
            new THREE.Color(0x000000),
            new THREE.Color(0x222244),
            pulse
        );
        tetrahedron.material.forEach(mat => mat.emissive.set(0x222244)); // subtle glow
        tetrahedron.rotation.x += 0.003; // Adjust rotation speed on the X-axis
        tetrahedron.rotation.y += 0.003; // Adjust rotation speed on the Y-axis
    }
    else
        tetrahedron.material.forEach(mat => mat.emissive.set(0x000000));

    renderer.render(scene, camera); // Render the scene from the perspective of the camera
}

export { animate };