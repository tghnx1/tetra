import { camera } from './scene.js';
import { tetrahedron } from './tetrahedron.js';

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
    const pointer = document.getElementById('pointer-container');
    if (pointer) pointer.style.display = 'none';
}

function onMouseMove(event) {
    if (!isDragging) return;

    const rotationSpeed = 0.005; // Adjust rotation speed

    // Use event.movementX/movementY (mouse movement) OR default to 0 if unavailable
    const deltaX = event.movementX || event.deltaX || 0; // Horizontal movement
    const deltaY = event.movementY || event.deltaY || 0; // Vertical movement

    // Update drag threshold (track movement distance)
    dragThreshold += Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    tetrahedron.rotation.y += deltaX * rotationSpeed; // Rotate on Y-axis
    tetrahedron.rotation.x += deltaY * rotationSpeed; // Rotate on X-axis
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

    tetrahedron.rotation.y += deltaX * rotationSpeed; // Rotate on Y-axis
    tetrahedron.rotation.x += deltaY * rotationSpeed; // Rotate on X-axis

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
    const intersects = raycaster.intersectObject(tetrahedron);

    if (intersects.length > 0) {
        const faceIndex = intersects[0].faceIndex;
        redirectToPage(faceIndex);
    }
}

function redirectToPage(faceIndex) {
    const pages = [
        './Pages/Promo.html',
        './Pages/Babbibrun.html',
        './Pages/Atmos.html',
        './Pages/Holywanderer.html',
    ];
    if (faceIndex >= 0 && faceIndex < pages.length) {
        const url = pages[faceIndex];
        if (url.startsWith('http')) {
            window.open(url, '_blank');
            return;
        }
        fetch(url)
            .then(res => res.text())
            .then(html => {
                // Извлекаем только содержимое <section> (или нужный фрагмент)
                const temp = document.createElement('div');
                temp.innerHTML = html;
                const section = temp.querySelector('section');
                document.getElementById('overlay-inner').innerHTML = section ? section.outerHTML : html;
                document.getElementById('overlay-content').style.display = 'block';
            });
    }
}

// Touch event handlers
function onTouchStart(event) {
    isDragging = true; // Start dragging
    dragThreshold = 0;
    lastTouchX = event.touches[0].clientX;
    lastTouchY = event.touches[0].clientY;
    const pointer = document.getElementById('pointer-container');
    if (pointer) pointer.style.display = 'none';
}

function onTouchEnd() {
    isDragging = false; // Stop dragging
    if (dragThreshold > maxClickThreshold) return; // It was a drag, not a click.

    // Convert touch coordinates to normalized device coordinates
    mouse.x = (lastTouchX / window.innerWidth) * 2 - 1;
    mouse.y = -(lastTouchY / window.innerHeight) * 2 + 1;

    // Perform raycasting
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(tetrahedron);

    if (intersects.length > 0) {
        // Use the triangle index directly
        const faceIndex = intersects[0].faceIndex;
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