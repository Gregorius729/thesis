import '../style.css'

import * as THREE from 'three';
import Stats from 'stats.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { addGUI } from './controller/gui/gui.js';
import { renderLSystem } from './render/renderLSystem.js';
import { renderIFS } from './render/renderIFS';

let scene, camera, renderer;
let ambientLight, directionalLight;
let stats;
let controls;

function init(){
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector(`#bg`),
  });
  
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.position.set(0, 100, 100);

  const axesHelper = new THREE.AxesHelper( 1000 );
  scene.add( axesHelper );
  addLights();
  addGUI();
  addControls();
  addStats();

  renderer.render(scene, camera);
}

let oldBranches = [];
let oldSponge;

export function generateFractal(fractalParams, fractalType) {
  scene.remove(oldSponge);
  oldBranches.forEach(branch => {
    scene.remove(branch);
  })

  if(fractalType == "L-System") {
    let branches = renderLSystem(fractalParams);
    oldBranches = branches;
    let newBranches = branches; // not pretty.. need another code to ged rid of the first branch
  
    newBranches.shift();
    newBranches.forEach(branch => {
      console.log(branch);
      scene.add(branch);
    })
  } else if (fractalType == "IFS") {
    let sponge = renderIFS(fractalParams);
    oldSponge = sponge;
    scene.add(sponge);
  }
}

function addLights() {
  ambientLight = new THREE.AmbientLight(0xffffff);
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1).normalize();

  scene.add(directionalLight, ambientLight);
}

function addControls() {
  controls = new OrbitControls(camera, renderer.domElement);
}

function addStats() {
  stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
}

function handleWindowResize() {
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function animate(){
  requestAnimationFrame(animate);
  window.addEventListener( 'resize', handleWindowResize, false );
  controls.update();
  stats.update();
  renderer.render(scene, camera);
}

init();
animate();
