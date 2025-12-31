import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

// 1. The Floor
const planeGeometry = new THREE.PlaneGeometry(15, 15);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// 2. A Cube
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 1, 0);
box.castShadow = true;
box.name = "myInteractiveBox";
scene.add(box);


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

  // Raycasting logic
  raycaster.setFromCamera( pointer, camera );
  const intersects = raycaster.intersectObjects( scene.children );

  // 1. Reset object to original state (clean up previous frame)
  if(box.material.color.getHex() !== 0x00ff00) {
      box.material.color.set(0x00ff00);
  }

  // 2. Check for intersections
  let isHoveringBox = false; // Track if we found the box

  for ( let i = 0; i < intersects.length; i ++ ) {
      if(intersects[i].object.name === "myInteractiveBox") {
          intersects[i].object.material.color.set(0xff0000); // Red on hover
          isHoveringBox = true;
      }
  }
  
  // 3. Update cursor based on flag
  if(isHoveringBox) {
      document.body.style.cursor = "pointer";
  } else {
      document.body.style.cursor = "default";
  }

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