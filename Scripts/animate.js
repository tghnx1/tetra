import { cube } from './cube.js';
import { isDragging } from './controls.js'; // Import the isDragging state

function animate(renderer, scene, camera) {
    // Rotate only if no dragging is happening
    if (!isDragging) {
        cube.rotation.x += 0.003; // Adjust rotation speed on the X-axis
        cube.rotation.y += 0.003; // Adjust rotation speed on the Y-axis
    }

    renderer.render(scene, camera); // Render the scene from the perspective of the camera
}

export { animate };