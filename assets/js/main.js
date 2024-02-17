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

//Create a Three.JS Scene
const scene = new THREE.Scene();
//Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

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

updateRendererSize();


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

//Function to render the scene in a loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}



//Instantiate a loader for the 3d .gltf file
const loader = new GLTFLoader();
//Load the file
loader.load(
  `/models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    // Adjust the model position
    object.rotation.y = -0.8;
    camera.position.set(0, 0, 7);

    //Center the model
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    object.position.sub(center);

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


