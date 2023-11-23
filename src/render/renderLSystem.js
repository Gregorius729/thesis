import * as THREE from 'three';
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

export function renderLSystem(lSystemParams) {
  let fractal = iterateLSystem(lSystemParams);

  const ruleIterator = fractal[Symbol.iterator]();
  let ruleChar = ruleIterator.next();
  let branches = [];
  let states = [];
  let isNewBranch = false;

  let leafGeometries = [];
  let leafGeometry = new THREE.BoxGeometry(
    lSystemParams.leafLength, lSystemParams.leafLength, lSystemParams.leafLength);
  let isNextLeaf = false;

  let branchGeometry = new THREE.CylinderGeometry(
      lSystemParams.radiusTop, lSystemParams.radiusBottom, 
      lSystemParams.height, lSystemParams.radialSegments,
    );
  let branchMaterial = new THREE.MeshLambertMaterial({ color: 0x964B00 });
  let currBranch = new THREE.Mesh(branchGeometry, branchMaterial);
  // let variablesArray = lSystemParams.variables.split(',').map(variable => variable.trim());
  let constantsArray = lSystemParams.constants.split(',').map(constant => constant.trim());

  let heightModifier = lSystemParams.heightModifier;
  let widthModifier = lSystemParams.widthModifier;
  let modifiers = [];

  while (!ruleChar.done) {
    if(constantsArray.includes(ruleChar.value)){
      if (isNewBranch) {
        let height = currBranch.geometry.parameters.height;
        if (lSystemParams.ifModify) {
          currBranch.scale.y = heightModifier;
          currBranch.scale.x = -widthModifier;
          currBranch.scale.z = -widthModifier;
          widthModifier *= 0.9;
          heightModifier *= 0.9;
          height *= heightModifier;
        }
        currBranch = translateBranch(currBranch, height / 2);
        isNewBranch = false;
      }
      if(ruleChar.value == '[') {
        states.push(currBranch.clone());
        if (lSystemParams.ifModify) {
          modifiers.push({
            heightModifier: heightModifier,
            widthModifier: widthModifier
          });
        }
        isNextLeaf = true;
      } else if((ruleChar.value == ']') && (states.length > 0)) {
        if((isNextLeaf) && (lSystemParams.ifLeaf)) {
          isNextLeaf = false;
          let leafPosition = currBranch.position;
          let leafCopy = leafGeometry.clone();
          leafCopy.translate(leafPosition.x, leafPosition.y, leafPosition.z);
          leafGeometries.push(leafCopy);
        }
        currBranch = states[states.length - 1].clone();
        if (lSystemParams.ifModify) {
          heightModifier = modifiers[modifiers.length - 1].heightModifier;
          widthModifier = modifiers[modifiers.length - 1].widthModifier;
          modifiers.pop();
        }
        states.pop();
      } else if(ruleChar.value == 'F') {
        let height = currBranch.geometry.parameters.height;
        if (lSystemParams.ifModify) {
          currBranch.scale.y = heightModifier;
          currBranch.scale.x = -widthModifier;
          currBranch.scale.z = -widthModifier;
          widthModifier *= 0.9;
          heightModifier *= 0.9;
          height *= heightModifier;
        }
        currBranch = translateBranch(currBranch, height / 2);
        branches.push(currBranch.clone());
        isNewBranch = true;
      } else {
        currBranch = rotateBranch(ruleChar.value, currBranch, lSystemParams);
      }
    }
    ruleChar = ruleIterator.next();
  }
  let group = new THREE.Group();
  branches.forEach(branch => {
    group.add(branch);
  });

  if(lSystemParams.ifLeaf) {
    let leaves = BufferGeometryUtils.mergeGeometries(leafGeometries);
    let combinedMesh = new THREE.Mesh(
      leaves,
      new THREE.MeshNormalMaterial()
    );
    group.add(combinedMesh);
  }

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
    branch.rotation.y -= Math.PI;
    branch.rotation.z -= Math.PI;
  }
  return branch;
}

function translateBranch(branch, length) {
  branch.translateY(length);
  return branch;
}

