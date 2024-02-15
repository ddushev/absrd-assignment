//Import the THREE.js library
import * as THREE from "three";
// To allow for the camera to move around the scene
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// To allow for importing the .gltf file
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//Set which object to render
const objToRender = 'cybertruck';
//Keep the 3D object on a global variable so we can access it later
let object;

//Correctly set width/height of the device
let width = window.screen.availWidth >= window.innerWidth ? window.innerWidth : window.screen.availWidth;
let height = window.screen.availHeight >= window.innerHeight ? window.innerHeight : window.screen.availHeight;

//Create a Three.JS Scene
const scene = new THREE.Scene();
//Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); //Alpha: true allows for the transparent background

//Add the renderer to the DOM
const container = document.getElementById("container3D");
container.appendChild(renderer.domElement);

// Function to update renderer size and camera aspect ratio
function updateRendererSize() {
  const containerRect = container.getBoundingClientRect();
  // Set the size of the renderer to match the container
  renderer.setSize(containerRect.width, containerRect.height);

  // Update the aspect ratio of the camera to match the container
  camera.aspect = containerRect.width / containerRect.height;
  camera.updateProjectionMatrix();
}

// Function to update camera position based on screen width
function updateCameraPosition() {
  if (width <= 550) {
    camera.position.set(0, 2, 15);
  } else if (width <= 750) {
    camera.position.set(0, 2, 11);
  } else {
    camera.position.set(0, 2, 7);
  }
}

updateRendererSize();
updateCameraPosition();

//Function to render the scene in a loop
function animate() {
  requestAnimationFrame(animate);

  //Rotate the model
  // object.rotation.x += 0.005;
  // object.rotation.y += 0.005;
  // object.rotation.z += 0.005;

  renderer.render(scene, camera);
}



//Instantiate a loader for the 3d .gltf file
const loader = new GLTFLoader();
//Load the file
loader.load(
  `assets/models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    // Adjust the model position
    object.rotation.y = -0.8;
    scene.add(object);

    //Start the 3D render loop
    animate();
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

// Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", () => {
  //Update the width/height on re-size
  width = window.screen.availWidth >= window.innerWidth ? window.innerWidth : window.screen.availWidth;
  height = window.screen.availHeight >= window.innerHeight ? window.innerHeight : window.screen.availHeight;
  // console.log('window.screen.availWidth', window.screen.availWidth);
  // console.log('window.innerWidth', window.innerWidth);
  // console.log({ width });
  updateRendererSize();
  updateCameraPosition();
});


//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 5); // (color, intensity)
topLight.position.set(200, 200, 200) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
const controls = new OrbitControls(camera, renderer.domElement);

// Add event listeners to enable/disable OrbitControls based on mouse position
document.getElementById("container3D").addEventListener("mouseenter", function () {
  controls.enabled = true;
});

document.getElementById("container3D").addEventListener("mouseleave", function () {
  controls.enabled = false;
});

