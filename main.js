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
var preloadCtr, variablesCtr, constantsCtr, startCtr, rulesCtr, angleCtr, iterateCtr;
var generateLSystemButton, fractalTypesDropdown;

var fractalGUI = {
	fractalTypes: "Select one",
  preload: "Select one",
  generate: function() { renderLSystem() }
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

function addGUI() {

  var fractalTypes = ["L-System", "IFS", "Limitation set"];
  var currFractalType = fractalGUI.fractalTypes;
  fractalTypesDropdown = gui.add(fractalGUI, 'fractalTypes', fractalTypes).name("Fractal Type");

  fractalTypesDropdown.onChange( value => {
    if(currFractalType == "L-System"){
      lSystemParamsFolder.destroy();
      generateLSystemButton.destroy();
      preloadCtr.destroy();
    }
    // } else if (currFractalType == fractalTypes[1]) {
    //   IFS.destroy();
    // } else if (currFractalType == fractalTypes[2]) {
    //   limSet.destroy();
    // }
    if(value == fractalTypes[0]) {
      createLSystem();
    }
    currFractalType = value;
  } );
}

function createLSystem(){
  var lSystemPreloads = {"Custom" : preloadCustom, "Tree" : preloadTree, "Curve" : preloadCurve};
  preloadCtr = gui.add(fractalGUI, 'preload', lSystemPreloads).name("Preload");

  lSystemParamsFolder = gui.addFolder('L-System params').hide(); // not pretty


  //TODO REAL TIME VALIDATION FOR VARIABLES AND RULES
  variablesCtr = lSystemParamsFolder.add(lSystemParams, 'variables').name('Variables');
  constantsCtr = lSystemParamsFolder.add(lSystemParams, 'constants').name('Constants').disable();
  startCtr = lSystemParamsFolder.add(lSystemParams, 'start').name('Start');
  rulesCtr = lSystemParamsFolder.addFolder( 'Rules' );
  angleCtr = lSystemParamsFolder.add(lSystemParams, 'angle', 0, 180, 1).name('Angle');
  iterateCtr = lSystemParamsFolder.add(lSystemParams, 'iterate', 1, 5, 1).name('Iterate');

  generateLSystemButton = gui.add(fractalGUI, 'generate').name('Generate').hide();

  preloadCtr.onChange( value => {
    loadPreload(value);
  });
  
  lSystemParamsFolder.onFinishChange( event => {
    changeLSystem(event);
  })
}

function changeRules(rules){
  if(rulesCtr){
    rulesCtr.controllersRecursive().forEach(rule => {
      rule.destroy();
    });
  }
  lSystemParams.rules.splice(0, lSystemParams.rules.length);
  rules.forEach(rule => {
    lSystemParams.rules.push(rule);
    rulesCtr.add(rule, 'rule').name(rule.variable);
  });
}

function changeLSystem(event) {
  if(event.controller == variablesCtr){
    let oldRules = []
    let newRules = [];
    let variablesArray = event.value.split(',').map(variable => variable.trim());
    rulesCtr.controllersRecursive().forEach(currRule => {
      oldRules.push({variable: currRule._name, rule: currRule.getValue()});
    });

    let newVariable = true;
    variablesArray.forEach(currVariable => {
      newVariable = true;
      oldRules.forEach(oldRule => {
        if(currVariable == oldRule.variable) {
          newVariable = false;
          newRules.push(oldRule);
        }
      });
      if(newVariable) {
        newRules.push({variable: currVariable, rule: currVariable})
      }
    });
    changeRules(newRules);
  }
}

function loadPreload(preload) {
  lSystemParamsFolder.show();
  generateLSystemButton.show();

  variablesCtr.setValue(preload.variables);
  constantsCtr.setValue(preload.constants);
  startCtr.setValue(preload.start);

  changeRules(preload.rules);

  angleCtr.setValue(preload.angle);
  iterateCtr.setValue(preload.iterate);
}

function renderLSystem() {
  let fractal = iterateLSystem();

  const iterator = fractal[Symbol.iterator]();
  let theChar = iterator.next();

  while (!theChar.done) {
    if(theChar.value == 'A'){
      createBranch();
    }
    theChar = iterator.next();
  }
}

function iterateLSystem() {
  let fractal = lSystemParams.start;
  for(let i = 0; i < lSystemParams.iterate; i++){
    lSystemParams.rules.forEach(rule => {
      fractal = fractal.replaceAll(rule.variable, rule.rule);
    })
  }
  return fractal;
}

function createBranch() {
  branchGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
  branchMaterial = new THREE.MeshLambertMaterial({ color: 0x964B00 });
  branch = new THREE.Mesh(branchGeometry, branchMaterial);


  scene.add( branch );
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
