import * as THREE from 'three';

export function renderLSystem(lSystemParams) {
  let branchGeometry = new THREE.CylinderGeometry(1.5, 2, 30, 10);
  let branchMaterial = new THREE.MeshLambertMaterial({ color: 0x964B00 });
  let currBranch = new THREE.Mesh(branchGeometry, branchMaterial);

  let firstIteration = new THREE.Group();

  let lSystemIteration = lSystemParams.start.replaceAll(lSystemParams.variables, lSystemParams.rules[0].rule);

  firstIteration.add(currBranch);
  firstIteration = iterateLSystem(lSystemIteration, lSystemParams, firstIteration, 0.9, 0.9);

  let currIteration = new THREE.Group();
  currIteration.add(currBranch);

  for(let i = 0; i < lSystemParams.iterate; i++){
    currIteration = iterateLSystem(lSystemIteration, lSystemParams, currIteration, 0.9, 0.9);
    // currIteration.remove(currIteration.children[0]);
  }

  console.log(currIteration);
  return currIteration;
}

function iterateLSystem(lSystemIteration, lSystemParams, currIteration, heightModifier, widthModifier) {
  let nextIteration = new THREE.Group();
  let states = [];
  let modifiers = [];
  let isNewIteration = false;
  
  let variablesArray = lSystemParams.variables.split(',').map(variable => variable.trim());
  let constantsArray = lSystemParams.constants.split(',').map(constant => constant.trim());

  let firstIteration = new THREE.Group();
  firstIteration.add(currIteration);

  const iterator = lSystemIteration[Symbol.iterator]();
  let char = iterator.next();

  var groupSize = new THREE.Box3().setFromObject(currIteration);
  const size = new THREE.Vector3();
  groupSize.getSize(size);
  
  var height = size.y;

  console.log(height);
  while (!char.done) {
    if (constantsArray.includes(char.value)) {
      if (isNewIteration) {
        currIteration.scale.y *= heightModifier;
        currIteration.scale.x *= - widthModifier;
        currIteration.scale.z *= - widthModifier;
        currIteration.translateY(heightModifier * height / 2);
        isNewIteration = false;
      }
      if (char.value == '[') {
        states.push(currIteration.clone());
        modifiers.push({
          heightModifier: heightModifier,
          widthModifier: widthModifier
        });
      } else if((char.value == ']') && (states.length > 0)) {
        currIteration = states[states.length - 1].clone();
        heightModifier = modifiers[modifiers.length - 1].heightModifier;
        widthModifier = modifiers[modifiers.length - 1].widthModifier;
        modifiers.pop();
        states.pop();
      } else {
        // try if works with nextIteration
        currIteration = rotateBranch(char.value, currIteration, lSystemParams);
      } 
    } else if(variablesArray.includes(char.value)) {
      currIteration.scale.y *= heightModifier;
      currIteration.scale.x *= - widthModifier;
      currIteration.scale.z *= - widthModifier;
      widthModifier *= widthModifier;
      heightModifier *= heightModifier;
      currIteration.translateY(heightModifier * height / 2);
      nextIteration.add(currIteration.clone());
      isNewIteration = true;
    }
    char = iterator.next();
  }
  nextIteration.remove(firstIteration.children[0]);
  return nextIteration;
}

function rotateBranch(direction, branch, lSystemParams) {
  if(direction == '+') {
    branch.rotation.x += Math.PI / 180 * lSystemParams.angles[0].angle;
  } else if(direction == '-') {
    branch.rotation.x -= Math.PI / 180 * lSystemParams.angles[0].angle;
  } else if(direction == '&') {
    branch.rotation.y += Math.PI / 180 * lSystemParams.angles[1].angle;
  } else if(direction == '^') {
    branch.rotation.y -= Math.PI / 180 * lSystemParams.angles[1].angle;
  } else if(direction == '>') {
    branch.rotation.z += Math.PI / 180 * lSystemParams.angles[2].angle;
  } else if(direction == '<') {
    branch.rotation.z -= Math.PI / 180 * lSystemParams.angles[2].angle;
  } else if(direction == '|') {
    branch.rotation.x -= Math.PI;
  }
  return branch;
}