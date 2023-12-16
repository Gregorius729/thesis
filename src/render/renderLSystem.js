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
  let leafGeometry = new THREE.SphereGeometry(lSystemParams.leafLength); 
  let isNextLeaf = false;

  let branchGeometry = new THREE.CylinderGeometry(
      lSystemParams.radiusTop, lSystemParams.radiusBottom, 
      lSystemParams.height, lSystemParams.radialSegments,
    );
  let branchMaterial = new THREE.MeshLambertMaterial({ color: lSystemParams.branchColor });
  let currBranch = new THREE.Mesh(branchGeometry, branchMaterial);
  // let variablesArray = lSystemParams.variables.split(',').map(variable => variable.trim());
  let constantsArray = lSystemParams.constants.split(',').map(constant => constant.trim());

  let heightModifier = lSystemParams.heightModifier;
  let widthModifier = lSystemParams.widthModifier;
  let constHeightModifier = lSystemParams.heightModifier;
  let constWidthModifier = lSystemParams.widthModifier;
  let modifiers = [];

  while (!ruleChar.done) {
    if(constantsArray.includes(ruleChar.value)){
      if (isNewBranch) {
        let height = currBranch.geometry.parameters.height;
        if (lSystemParams.ifModify) {
          currBranch.scale.y = heightModifier;
          currBranch.scale.x = -widthModifier;
          currBranch.scale.z = -widthModifier;
          widthModifier *= constWidthModifier;
          heightModifier *= constHeightModifier;
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
      } else if(
          (ruleChar.value == '+') || (ruleChar.value == '-') || 
          (ruleChar.value == '^') || (ruleChar.value == '&') || 
          (ruleChar.value == '>') || (ruleChar.value == '<') || 
          (ruleChar.value == '|')
        ) {
        currBranch = rotateLSystem(ruleChar.value, currBranch, lSystemParams);
      } else {
        let height = currBranch.geometry.parameters.height;
        if (lSystemParams.ifModify) {
          currBranch.scale.y = heightModifier;
          currBranch.scale.x = -widthModifier;
          currBranch.scale.z = -widthModifier;
          widthModifier *= constWidthModifier;
          heightModifier *= constHeightModifier;
          height *= heightModifier;
        }
        currBranch = translateBranch(currBranch, height / 2);
        branches.push(currBranch.clone());
        isNewBranch = true;
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
      new THREE.MeshLambertMaterial( { color: lSystemParams.leafColor } )
    );
    group.add(combinedMesh);
  }

  return group;
}

function iterateLSystem(lSystemParams) {
  let fractal = lSystemParams.start;
  for(let i = 0; i < lSystemParams.iterate; i++){
    const ruleIterator = fractal[Symbol.iterator]();
    let ruleChar = ruleIterator.next();
    let newFractal = '';
    while (!ruleChar.done) {
      let currRule = lSystemParams.rules.find(rule => rule.variable === ruleChar.value);
      if(currRule == undefined) {
        newFractal += ruleChar.value;
      } else if(ruleChar.value == currRule.variable){
        newFractal += currRule.rule;
      }
      ruleChar = ruleIterator.next();
    }
    fractal = newFractal;
  }
  return fractal;
}

function rotateLSystem(direction, branch, lSystemParams) {
  if(direction == '+') {
    branch.rotation.z += Math.PI / 180 * lSystemParams.angles[0].angle;
  } else if(direction == '-') {
    branch.rotation.z -= Math.PI / 180 * lSystemParams.angles[0].angle;
  } else if(direction == '^') {
    branch.rotation.x += Math.PI / 180 * lSystemParams.angles[1].angle;
  } else if(direction == '&') {
    branch.rotation.x -= Math.PI / 180 * lSystemParams.angles[1].angle;
  } else if(direction == '>') {
    branch.rotation.y += Math.PI / 180 * lSystemParams.angles[2].angle;
  } else if(direction == '<') {
    branch.rotation.y -= Math.PI / 180 * lSystemParams.angles[2].angle;
  } else if(direction == '|') {
    branch.rotation.z -= Math.PI;
  }
  return branch;
}

function translateBranch(branch, length) {
  branch.translateY(length);
  return branch;
}

