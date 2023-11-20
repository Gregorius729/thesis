import * as THREE from 'three';

export function renderLSystem(lSystemParams) {
  let fractal = iterateLSystem(lSystemParams);

  const ruleIterator = fractal[Symbol.iterator]();
  let ruleChar = ruleIterator.next();
  let branches = [];
  let states = [];
  let isNewBranch = false;

  let branchGeometry = new THREE.CylinderGeometry(1, 1, 10, 10);
  let branchMaterial = new THREE.MeshLambertMaterial({ color: 0x964B00 });
  let currBranch = new THREE.Mesh(branchGeometry, branchMaterial);
  
  let variablesArray = lSystemParams.variables.split(',').map(variable => variable.trim());
  let constantsArray = lSystemParams.constants.split(',').map(constant => constant.trim());

  while (!ruleChar.done) {
    if(constantsArray.includes(ruleChar.value)){
      if (isNewBranch) {
        currBranch = translateBranch(currBranch, currBranch.geometry.parameters.height / 2);
        isNewBranch = false;
      }
      if(ruleChar.value == '[') {
        states.push(currBranch.clone());
      } else if(ruleChar.value == ']') {
        if(currBranch.length > 0) {
          currBranch = states[states.length - 1].clone();
          states.pop();
        }
      } else {
        currBranch = rotateBranch(ruleChar.value, currBranch, lSystemParams);
      }
    } else if(variablesArray.includes(ruleChar.value)) {
      currBranch = translateBranch(currBranch, currBranch.geometry.parameters.height / 2);
      branches.push(currBranch.clone());
      isNewBranch = true;
    }
    ruleChar = ruleIterator.next();
  }

  let group = new THREE.Group();
  branches.forEach(branch => {
    group.add(branch);
  });
  return group;
}

function iterateLSystem(lSystemParams) {
  let fractal = lSystemParams.start;
  for(let i = 0; i < lSystemParams.iterate; i++){
    lSystemParams.rules.forEach(rule => {
      fractal = fractal.replaceAll(rule.variable, rule.rule);
    })
  }
  return fractal;
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

function translateBranch(branch, length) {
  branch.translateY(length);
  return branch;
}