import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import { scene } from './scene.js';

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

// Define an array of materials, one for each face
const materials = textures.map(texture => new THREE.MeshPhongMaterial({ map: texture }));

// Define the geometry for the cube
const geometry = new THREE.BoxGeometry(4, 4, 4); // Cube dimensions (4x4x4)

// Create the cube mesh
const cube = new THREE.Mesh(geometry, materials);

// Set the starting position to isometric angles
cube.rotation.y = Math.PI / 4; // 45 degrees around the Y-axis
cube.rotation.x = Math.PI / 6; // 45 degrees around the X-axis

// Set the cube position to the center
cube.position.set(0, 0, 0);

// Add the cube to the scene
scene.add(cube);

// Function to adjust cube scale based on screen size
function adjustCubeScale() {
    console.log(`Screen size: ${window.innerWidth}x${window.innerHeight}`);
    if (window.innerWidth <= 980) { // Mobile screen size
        console.log('Mobile screen detected, scaling down the cube');
        cube.scale.set(0.5, 0.5, 0.5); // Scale down the cube
    } else {
        console.log('Larger screen detected, resetting cube scale');
        cube.scale.set(1, 1, 1); // Default scale
    }
}

// Adjust cube scale on window resize and load
window.addEventListener('resize', adjustCubeScale);
window.addEventListener('load', adjustCubeScale);

// Initial call to set the correct scale
adjustCubeScale();

export { cube };