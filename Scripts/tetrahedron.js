import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import {camera, scene} from './scene.js';

// ... your existing code above ...

// Define UVs for each face (map each triangle to the full square texture)
const uvs = [
    // Face 1: [0, 1, 2]
    0.5, 1,   0, 0,   1, 0,
    // Face 2: [0, 2, 3]
    0.5, 1,   0, 0,   1, 0,
    // Face 3: [0, 3, 1]
    0.5, 1,   0, 0,   1, 0,
    // Face 4: [1, 3, 2]
    0.5, 1,   0, 0,   1, 0,
];


// Load textures
const loader = new THREE.TextureLoader();
const textures = [
    loader.load('./Media/test.png'),
    loader.load('./Media/BABBIBRUN.png'),
    loader.load('./Media/ATMOS.png'),
    loader.load('./Media/HOLYWANDERER.png'),

];

// Create materials
const materials = textures.map(tex => new THREE.MeshPhongMaterial({ map: tex, flatShading: true }));


// Edge length
const a = 2;
// Height from base to top vertex
const h = Math.sqrt(2 / 3) * a;
// Height of the base triangle
const baseHeight = Math.sqrt(3) / 2 * a;
// Vertices: base in XZ-plane, top above centroid
const vertices = [
    new THREE.Vector3(0, h / 2, 0), // Top vertex (centered above base)
    new THREE.Vector3(-a / 2, -h / 2, baseHeight / 3), // Base vertex 1
    new THREE.Vector3(a / 2, -h / 2, baseHeight / 3),  // Base vertex 2
    new THREE.Vector3(0, -h / 2, -2 * baseHeight / 3), // Base vertex 3
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

// When creating geometry, set groups for each face
geometry.clearGroups();
for (let i = 0; i < 4; i++) {
    geometry.addGroup(i * 3, 3, i); // 3 vertices per face, material index = i
}

const positions = [];
for (const face of faces) {
    for (const idx of face) {
        positions.push(vertices[idx].x, vertices[idx].y, vertices[idx].z);
    }
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
geometry.computeVertexNormals();

// Create the tetrahedron mesh
const tetrahedron = new THREE.Mesh(geometry, materials);


// Set the starting position to isometric angles
tetrahedron.rotation.y = 0;
tetrahedron.rotation.x = 0;


// Add the tetrahedron to the scene
scene.add(tetrahedron);
//camera.position.x = 2.5;
//camera.position.z = 5;

// Function to adjust tetrahedron scale based on screen size
function adjustCubeScale() {
    console.log(`Screen size: ${window.innerWidth}x${window.innerHeight}`);
    if (window.innerWidth <= 980) { // Mobile screen size
        console.log('Mobile screen detected, scaling down the tetrahedron');
        tetrahedron.scale.set(1.2, 1.2, 1.2); // Scale down the tetrahedron
        tetrahedron.position.set(0, -2, -6);
    }
    else {
        // Desktop: original position
        tetrahedron.scale.set(2, 2, 2);
        tetrahedron.position.set(-2.5, 0, -5);
    }
}

// Adjust tetrahedron scale on window resize and load
window.addEventListener('resize', adjustCubeScale);
window.addEventListener('load', adjustCubeScale);

// Initial call to set the correct scale
adjustCubeScale();

export { tetrahedron };