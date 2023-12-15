import '../style.css'

import * as THREE from 'three';
import Stats from 'stats.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { addGUI, GUIParams, currFractalType } from './controller/gui/gui.js';
import { renderLSystem } from './render/renderLSystem.js';
import { renderIFS } from './render/renderIFS';
import { GUI } from 'lil-gui';

let scene, camera, renderer;
let ambientLight, directionalLight;
let stats;
let controls;
let controlsCtr, resetCameraButton, axesHelperCheckbox, statsCheckbox;
let animateCheckbox, animateSpeedCtr;
const axesHelper = new THREE.AxesHelper( 1000 );
stats = new Stats();
stats.showPanel(0);

export let fractalGUI = {
  fractalTypes: "Select one",
  resetCamera: function() { resetCamera() },
  axesHelper: false,
  stats: false,
  preload: "Select one",
  animate: false,
  animateSpeed: 0.02,
  generate: function() { generateFractal(GUIParams, currFractalType) }
};

export const gui = new GUI();
gui.title('Fractal Generator');

function init(){
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector(`#bg`),
  });
  
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.position.set(100, 100, 100);

  controlsCtr = gui.addFolder('Controls').close();
  axesHelperCheckbox = controlsCtr.add(fractalGUI, 'axesHelper').name('Axes helper').onChange( value => {
    isAxesHelper(value);
  });
  statsCheckbox = controlsCtr.add(fractalGUI, 'stats').name('Stats').onChange( value => {
    isStats(value);
  });
  animateCheckbox = controlsCtr.add(fractalGUI, 'animate').name('Animate');
  animateSpeedCtr = controlsCtr.add(fractalGUI, 'animateSpeed', 0.005, 0.1, 0.005).name('Animate speed');
  resetCameraButton = controlsCtr.add(fractalGUI, 'resetCamera').name('Reset camera');
  
  addLights();
  addGUI();
  addControls();

  renderer.render(scene, camera);
}

let LSystem;
let IFS;

function resetCamera() {
  controls.reset();
  
  camera.position.set(100, 100, 100);
  camera.lookAt(0, 0, 0);
}

function generateFractal(fractalParams, fractalType) {
  scene.remove(LSystem);
  scene.remove(IFS);

  if(fractalType == "L-System") {
    LSystem = renderLSystem(fractalParams);
    LSystem.name = "LSystem";

    var groupSize = new THREE.Box3().setFromObject(LSystem);
    const size = new THREE.Vector3();
    groupSize.getSize(size);

    LSystem.position.y = -size.y / 2;

    scene.add(LSystem);
  } else if (fractalType == "Other") {
    IFS = renderIFS(fractalParams);
    IFS.name = "Other";
    scene.add(IFS);
  }
}

function animateFractal(fractalGUI, LSystem, IFS) {
  if(fractalGUI.animate) {
    if(scene.getObjectByName("LSystem")) {
      LSystem.rotation.y += fractalGUI.animateSpeed;
    } else if (scene.getObjectByName("Other")) {
      IFS.rotation.y += fractalGUI.animateSpeed;
    }
  }
}

function isAxesHelper(isHelperVisible) {
  if(isHelperVisible) {
    scene.add( axesHelper );
  } else {
    scene.remove( axesHelper )
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
  controls.saveState();
}

function isStats(isStatsVisible) {
  if(isStatsVisible) {
    document.body.appendChild(stats.dom);
  } else {
    document.body.removeChild(stats.dom);
  }
}

function handleWindowResize() {
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function animate(){
  requestAnimationFrame(animate);
  animateFractal(fractalGUI, LSystem, IFS);
  window.addEventListener( 'resize', handleWindowResize, false );
  controls.update();
  stats.update();
  renderer.render(scene, camera);
}

init();
animate();
