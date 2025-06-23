import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import { scene } from './scene.js';


/*
// Load texture using TextureLoader
const textureLoader = new THREE.TextureLoader();
// Load textures for all six faces
const textures = [
    textureLoader.load('./Media/Playground.png'), // Front face
    textureLoader.load('./Media/Matr.png'), // Back face
    textureLoader.load('./Media/Who.png'), // Top face
    textureLoader.load('./Media/Legalisation.png'), // Bottom face
    textureLoader.load('./Media/Whoroscope.png'), // Right face
    textureLoader.load('./Media/White.png'), // Left face
];

// Disable mipmaps for sharpness
textures.forEach(texture => {
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
});

*/

// Custom vertices for a "flatter" tetrahedron
const vertices = [
    new THREE.Vector3(0, 2, 0),    // Top vertex (move closer to base for blunter angles)
    new THREE.Vector3(-2, -2, 2),  // Base vertex 1
    new THREE.Vector3(2, -2, 2),   // Base vertex 2
    new THREE.Vector3(0, -2, -2),  // Base vertex 3
];

// Define faces using the indices of the vertices
const faces = [
    [0, 1, 2],
    [0, 2, 3],
    [0, 3, 1],
    [1, 3, 2],
];

// Create geometry and add vertices/faces
const geometry = new THREE.BufferGeometry();
const positions = [];
for (const face of faces) {
    for (const idx of face) {
        positions.push(vertices[idx].x, vertices[idx].y, vertices[idx].z);
    }
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.computeVertexNormals();

// Use a single color or texture material
const material = new THREE.MeshPhongMaterial({ color: 0x00ffcc, flatShading: true });

// Create the tetrahedron mesh
const tetrahedron = new THREE.Mesh(geometry, material);

// Set the starting position to isometric angles
tetrahedron.rotation.y = Math.PI / 4; // 45 degrees around the Y-axis
tetrahedron.rotation.x = Math.PI / 6; // 45 degrees around the X-axis

// Set the tetrahedron position to the center
tetrahedron.position.set(0, 0, 0);

// Add the tetrahedron to the scene
scene.add(tetrahedron);

// Function to adjust tetrahedron scale based on screen size
function adjustCubeScale() {
    console.log(`Screen size: ${window.innerWidth}x${window.innerHeight}`);
    if (window.innerWidth <= 980) { // Mobile screen size
        console.log('Mobile screen detected, scaling down the tetrahedron');
        tetrahedron.scale.set(0.5, 0.5, 0.5); // Scale down the tetrahedron
    } else {
        console.log('Larger screen detected, resetting tetrahedron scale');
        tetrahedron.scale.set(0.8, 0.8, 0.8); // Default scale
    }
}

// Adjust tetrahedron scale on window resize and load
window.addEventListener('resize', adjustCubeScale);
window.addEventListener('load', adjustCubeScale);

// Initial call to set the correct scale
adjustCubeScale();

export { tetrahedron };