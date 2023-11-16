import './style.css'

import * as THREE from 'three';
import { GUI } from 'lil-gui';
import Stats from 'stats.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


var scene, camera, renderer;
var branchGeometry, branchMaterial, branch;
var ambientLight, directionalLight;
var stats;
var controls;
var lSystemParamsFolder;
var lSystemParamsRulesFolder;
var preloadCtr, variablesCtr, constantsCtr, startCtr, rulesCtr, angleCtr, iterateCtr;

var fractalGUI = {
	fractalTypes: "Select one",
  preload: "Select one",
};

var preloadCustom = {
  variables: "",
  constants: "+, -, [, ]",
  start: "",
  rules: [],
  angle: 0,
  iterate: 1,
};

var preloadTree = {
  variables: "A, B",
  constants: "+, -, [, ]",
  start: "A",
  rules: [
    {
      variable: "A",
      rule: "ABA"
    },
    {
      variable: "B",
      rule: "BB"
    }
  ],
  angle: 25,
  iterate: 3,
};

var preloadCurve = {
  variables: "QWE",
  constants: "+, -, [, ]",
  start: "Asd",
  rules: [
    {
      variable: "XT",
      rule: "ASD"
    },
    {
      variable: "rr",
      rule: "123"
    }
  ],
  angle: 123,
  iterate: 2,
};

var lSystemParams = {
  variables: "",
  constants: "+, -, [, ]",
  start: "",
  rules: [],
  angle: 0,
  iterate: 1,
  generate: function() { }
};

const gui = new GUI();

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

  var fractalTypes = ["L-System", "IFS", "Limitation set"];
  var currValue = fractalGUI.fractalTypes;
  gui.add(fractalGUI, 'fractalTypes', fractalTypes).name("Fractal Type").onChange( value => {
    if(currValue == fractalTypes[0]){
      lSystemParamsFolder.destroy();
    }
    // } else if (currValue == fractalTypes[1]) {
    //   IFS.destroy();
    // } else if (currValue == fractalTypes[2]) {
    //   limSet.destroy();
    // }
    if(value == fractalTypes[0]) {
      createLSystem();
    }
    currValue = value;
  } );
}

function createLSystem(){
  var lSystemPreloads = {"Custom" : preloadCustom, "Tree" : preloadTree, "Curve" : preloadCurve};
  preloadCtr = gui.add(fractalGUI, 'preload', lSystemPreloads).name("Preload");

  lSystemParamsFolder = gui.addFolder('L-System params').hide(); // not pretty

  variablesCtr = lSystemParamsFolder.add(lSystemParams, 'variables').name('Variables');
  constantsCtr = lSystemParamsFolder.add(lSystemParams, 'constants').name('Constants').disable();
  startCtr = lSystemParamsFolder.add(lSystemParams, 'start').name('Start');
  rulesCtr = lSystemParamsFolder.addFolder( 'Rules' );
  angleCtr = lSystemParamsFolder.add(lSystemParams, 'angle', 0, 180, 1).name('Angle');
  iterateCtr = lSystemParamsFolder.add(lSystemParams, 'iterate', 1, 5, 1).name('Iterate');

  lSystemParamsFolder.add(lSystemParams, 'generate').name('Generate');

  preloadCtr.onChange( value => {
    if(rulesCtr){
      rulesCtr.controllersRecursive().forEach(rule => {
        rule.destroy();
      });
    }
    loadPreload(value);
  });
  
  lSystemParamsFolder.onFinishChange( event => {
    changeLSystem(event);
  })
}

function changeLSystem(event) {
  variablesCtr.onFinishChange( function( variables ) {
    let variablesArray = variables.split(',').map(variable => variable.trim());
    lSystemParams.rules.splice(0, lSystemParams.rules.length);
    for (let i = 0; i <= variablesArray.length; i++) {
      lSystemParams.rules.forEach(rule => {
        let currVariable = lSystemParams.rules.find(rule => rule.variable === variablesArray[i]);
        lSystemParams.rules.push(rule);
        rulesCtr.add(rule, 'rule').name(`${rule.variable} -> `);
      });
    }
  });
}

function loadPreload(preload) {
  lSystemParamsFolder.show();

  variablesCtr.setValue(preload.variables);
  constantsCtr.setValue(preload.constants);
  startCtr.setValue(preload.start);

  lSystemParams.rules.splice(0, lSystemParams.rules.length);
  preload.rules.forEach(rule => {
    lSystemParams.rules.push(rule);
    rulesCtr.add(rule, 'rule').name(`${rule.variable} -> `);
  });

  angleCtr.setValue(preload.angle);
  iterateCtr.setValue(preload.iterate);
}

function renderFractal() {
  
}

function iterateFractal() {
  let currentSentence = lSystemParams.start;
  let newSentence = '';
  for (let i = 1; i <= lSystemParams.iterate; i++) {
      for (let j = 0; j < currentSentence.length; j++) {
          if (currentSentence[j] === 'F') {
              newSentence += rule1;
          } else if (currentSentence[j] === 'X') {
              newSentence += rule2;
          } else {
              newSentence += currentSentence[j];
          }
      }
      currentSentence = newSentence;
      newSentence = '';
  }
  // sentence = currentSentence;
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
  renderer.render(scene, camera);
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
