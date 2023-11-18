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
      rule: "A-B+A"
    },
    {
      variable: "B",
      rule: "B-B"
    }
  ],
  angle: 25,
  iterate: 3,
};

var preloadCurve = {
  variables: "F",
  constants: "+, -, [, ]",
  start: "F-F-F-F",
  rules: [
    {
      variable: "F",
      rule: "FF-F-F-F-F-F+F"
    },
  ],
  angle: 90,
  iterate: 4,
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

  const ruleIterator = fractal[Symbol.iterator]();
  let ruleChar = ruleIterator.next();
  let branches = [];
  let currBranch;
  let newBranch = false;
  branchGeometry = new THREE.CylinderGeometry(1, 1, 5, 10);
  branchMaterial = new THREE.MeshLambertMaterial({ color: 0x964B00 });
  currBranch = new THREE.Mesh(branchGeometry, branchMaterial);
  
  branches.push(currBranch);

  let variablesArray = lSystemParams.variables.split(',').map(variable => variable.trim());
  while (!ruleChar.done) {
    // now i have the l system 
    // i need to rotate the next branch like the last if this char is not a rotation
    // if it's not a rotation then i can add it to the scene
    if(!variablesArray.includes(ruleChar.value)){
      if (newBranch) {
        currBranch = translateBranch(currBranch, currBranch.geometry.parameters.height / 2);
        newBranch = false;
      }
      currBranch = rotateBranch(ruleChar.value, currBranch);
    } else {
      currBranch = translateBranch(currBranch, currBranch.geometry.parameters.height / 2);
      branches.push(currBranch.clone());
      newBranch = true;
    }
    ruleChar = ruleIterator.next();
  }
  addTreeToScene(branches);
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

function rotateBranch(direction, branch) {
  if(direction == '+') {
    branch.rotation.x += Math.PI / 180 * lSystemParams.angle;
  } else if(direction == '-') {
    branch.rotation.x -= Math.PI / 180 * lSystemParams.angle;
  }
  return branch;
}

function addTreeToScene(branches) {
  branches.forEach(branch => {
    scene.add(branch);
  })
}

function translateBranch(branch, length) {
  branch.translateY(length);
  return branch;
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
