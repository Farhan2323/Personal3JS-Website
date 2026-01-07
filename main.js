import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// 1. SETUP THE SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202025);

// 2. SETUP THE CAMERA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

// 3. SETUP THE RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// 4. ADD ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;

// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// --- ADDING OBJECTS ---

// --- LOAD THE ROOM MODEL ---
const loader = new GLTFLoader();
let roomMesh; // We create a variable so we can access the room later

loader.load(
  'room.glb', // Make sure this matches your file name exactly!
  function (gltf) {
    roomMesh = gltf.scene;
    
    // Adjust these if your model is too big/small or too high/low
    roomMesh.scale.set(1, 1, 1); 
    roomMesh.position.set(0, 0, 0);

    scene.add(roomMesh);
  },
  undefined, // Progress (leave blank)
  function (error) {
    console.error('An error happened:', error);
  }
);


// --- INTERACTIVITY (Raycaster) ---
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

window.addEventListener( 'mousemove', onPointerMove );

// --- ANIMATION LOOP ---
// This is the ONLY animate function you need.
function animate() {
  requestAnimationFrame(animate);
  
  controls.update();

  // We will add the raycaster (interaction) back later once the model works!
  // For now, we just want to see the room.

  renderer.render(scene, camera);
}

// Call animate once to start the loop
animate();

// --- RESIZE HANDLER ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});