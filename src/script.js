import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as lilGui from 'lil-gui';
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas');

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  45, // Field of View
  window.innerWidth / window.innerHeight, // Aspect Ratio
  0.1, // Near
  1000 // Far
);

// Initial position of the camera
camera.position.set(-4.9, 4.4, 1.9);
camera.rotation.set(-0.9, -0.8, -0.8);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = false; // Disable panning to prevent conflicts with touchpad
controls.enableKeys = false; // Disable default movement keys

// Enable touch events for zooming
controls.touches.ONE = THREE.TOUCH.PAN;
controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;

// Custom movement variables
const movementSpeed = 0.1; // Adjust movement speed
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Event listeners for key press and release
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

function onKeyDown(event) {
  switch (event.key) {
    case 'w':
      moveForward = true;
      break;
    case 's':
      moveBackward = true;
      break;
    case 'a':
      moveLeft = true;
      break;
    case 'd':
      moveRight = true;
      break;
  }
}

function onKeyUp(event) {
  switch (event.key) {
    case 'w':
      moveForward = false;
      break;
    case 's':
      moveBackward = false;
      break;
    case 'a':
      moveLeft = false;
      break;
    case 'd':
      moveRight = false;
      break;
  }
}

// Custom update function for movement
function updateMovement() {
  if (moveForward) {
    camera.translateZ(-movementSpeed);
  }
  if (moveBackward) {
    camera.translateZ(movementSpeed);
  }
  if (moveLeft) {
    camera.translateX(-movementSpeed);
  }
  if (moveRight) {
    camera.translateX(movementSpeed);
  }
}

// Update function for dragging sensitivity
function updateDragSensitivity() {
  controls.rotateSpeed = 0.2; // Adjust rotation speed here
}

// gltf Loader
const gltfLoader = new GLTFLoader();
gltfLoader.load('/model/swedish-royal/scene.gltf', (gltf) => {
  console.log('Our model here!', gltf);
  const model = gltf.scene;
  scene.add(model);

  window.addEventListener('mouseup', function () {
    switch (position) {
      case 0:
        controls.target.set(-6.0, 1.72, 1.34);
        break;

      case 1:
        controls.target.set(0.48, 2.09, -2.11);
        break;

      case 2:
        controls.target.set(-1.49, 1.7, 0.48);
        break;
    }
    position = (position + 1) % 3;
  });

  // GUI Configurator
  // const gui = new lilGui.GUI();
  // add the camera to the GUI
  //   gui
  //     .add(model.position, 'x')
  //     .min(-100)
  //     .max(100)
  //     .step(0.001)
  //     .name('Model X Axis Position');
  //   gui
  //     .add(model.position, 'y')
  //     .min(-100)
  //     .max(100)
  //     .step(0.001)
  //     .name('Model Y Axis Position');
  //   gui
  //     .add(model.position, 'z')
  //     .min(-100)
  //     .max(100)
  //     .step(0.001)
  //     .name('Model Z Axis Position');
});

// Animation and loop
const animate = () => {
  renderer.render(scene, camera);
  controls.update(); // Update controls
  updateMovement(); // Update custom movement
  updateDragSensitivity(); // Update drag sensitivity

  // controls.update();
};

renderer.setAnimationLoop(animate); // this is the same as requestAnimationFrame(animate). It will call the animate function over and over again on every frame.

animate();
