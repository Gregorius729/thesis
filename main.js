import './style.css'

import * as THREE from 'three';
import { GUI } from 'dat.gui';
import Stats from 'stats.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


var scene, camera, renderer;
var branchGeometry, branchMaterial, branch;
var ambientLight, directionalLight;
var gui, textInput;
var stats;
var controls;

var rule;

function init(){
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector(`#bg`),
  });
  
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.position.set(0, 100, 100);

  createBranch();
  addLights();
  addGUI();
  addControls();
  addStats();

  renderer.render(scene, camera);
}

function createBranch() {
  branchGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
  branchMaterial = new THREE.MeshLambertMaterial({ color: 0x964B00 });
  branch = new THREE.Mesh(branchGeometry, branchMaterial);

  scene.add( branch );
}

function addGUI() {
  gui = new GUI();

  textInput = {
    test: "F=F+F-X"
  };
  
  rule = textInput.test;

  gui.add(textInput, 'test').name('Input Text').onFinishChange(function() {
    rule = checkIfValidRule(textInput.test) ? textInput.test : rule;
  });
}

function checkIfValidRule(newRule) {
  //TODO valid check
  return true;
}

function addLights() {
  ambientLight = new THREE.AmbientLight(0x404040);
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
  renderer.render(scene, camera);
}

function animate(){
  requestAnimationFrame (animate);
  window.addEventListener( 'resize', handleWindowResize, false );
  controls.update();
  stats.update();
  renderer.render(scene, camera);
}

init();
animate();
