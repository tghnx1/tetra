import { camera } from './scene.js';
import { cube } from './cube.js';

let isDragging = false;
export { isDragging };
let dragThreshold = 0; // Records the total movement during dragging
const maxClickThreshold = 5; // Maximum movement (in pixels) to still consider as a click


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let lastTouchX = 0;
let lastTouchY = 0;

function onMouseDown() {
    isDragging = true; // Start dragging
    dragThreshold = 0;
}

function onMouseMove(event) {
    if (!isDragging) return;

    const rotationSpeed = 0.005; // Adjust rotation speed

    // Use event.movementX/movementY (mouse movement) OR default to 0 if unavailable
    const deltaX = event.movementX || event.deltaX || 0; // Horizontal movement
    const deltaY = event.movementY || event.deltaY || 0; // Vertical movement

    // Update drag threshold (track movement distance)
    dragThreshold += Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    cube.rotation.y += deltaX * rotationSpeed; // Rotate on Y-axis
    cube.rotation.x += deltaY * rotationSpeed; // Rotate on X-axis
}

function onTouchMove(event) {
    if (!isDragging) return;

    event.preventDefault(); // Prevent the browser from swiping down

    const rotationSpeed = 0.005; // Adjust rotation speed

    const touch = event.touches[0];
    const deltaX = touch.clientX - lastTouchX; // Horizontal movement
    const deltaY = touch.clientY - lastTouchY; // Vertical movement

    // Update drag threshold (track movement distance)
    dragThreshold += Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    cube.rotation.y += deltaX * rotationSpeed; // Rotate on Y-axis
    cube.rotation.x += deltaY * rotationSpeed; // Rotate on X-axis

    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
}


function onMouseUp() {
    isDragging = false; // Stop dragging
}


function onMouseClick(event) {
    if (dragThreshold > maxClickThreshold)
        return; // It was a drag, so don't navigate.
        // Convert mouse click to normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Perform raycasting
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(cube);

    if (intersects.length > 0) {
        const faceIndex = Math.floor(intersects[0].faceIndex / 2); // Get cube face
        redirectToPage(faceIndex);
    }
}

function redirectToPage(faceIndex) {
    const pages = [
        './Pages/Playground.html',
        './Pages/Marteshka.html',
        './Pages/About.html',
        './Pages/Legalisation.html',
        './Pages/Whoroscope.html',
    ];
    if (faceIndex >= 0 && faceIndex < pages.length) {
        window.location.href = pages[faceIndex]; // Navigate to corresponding page
    }
}

// Touch event handlers
function onTouchStart(event) {
    isDragging = true; // Start dragging
    dragThreshold = 0;
    lastTouchX = event.touches[0].clientX;
    lastTouchY = event.touches[0].clientY;
}

function onTouchEnd() {
    isDragging = false; // Stop dragging
    if (dragThreshold > maxClickThreshold) return; // It was a drag, not a click.

    // Convert touch coordinates to normalized device coordinates
    mouse.x = (lastTouchX / window.innerWidth) * 2 - 1;
    mouse.y = -(lastTouchY / window.innerHeight) * 2 + 1;

    // Perform raycasting
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(cube);

    if (intersects.length > 0) {
        const faceIndex = Math.floor(intersects[0].faceIndex / 2); // Get cube face
        redirectToPage(faceIndex);
    }
}

function registerEventListeners() {
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('click', onMouseClick); // Enable raycasting
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd,{ passive: false });
    window.addEventListener('resize', () => {
        console.log("Updated screen width:", window.innerWidth);
    });
}


export { registerEventListeners };