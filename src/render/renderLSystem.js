import * as THREE from 'three';

export function renderLSystem(lSystemParams) {

  // const ruleIterator = fractal[Symbol.iterator]();
  // let ruleChar = ruleIterator.next();
  // let branches = [];
  // let states = [];
  // let isNewBranch = false;

  // let leafGeometries = [];
  // let leafGeometry = new THREE.BoxGeometry(10, 10, 10);
  // let isLeaf = false;

  let branchGeometry = new THREE.CylinderGeometry(1.5, 2, 30, 10);
  let branchMaterial = new THREE.MeshLambertMaterial({ color: 0x964B00 });
  let currBranch = new THREE.Mesh(branchGeometry, branchMaterial);
  // let variablesArray = lSystemParams.variables.split(',').map(variable => variable.trim());
  // let constantsArray = lSystemParams.constants.split(',').map(constant => constant.trim());
  // currBranch.position.set(0, -branchGeometry.parameters.height, 0);

  let currIteration = new THREE.Group();

  currIteration.add(currBranch);
  let lSystemIteration = lSystemParams.start;
  lSystemParams.rules.forEach(rule => {
    lSystemIteration = lSystemIteration.replaceAll(rule.variable, rule.rule);
  })

  for(let i = 0; i < lSystemParams.iterate; i++){
    let oldIteration = currIteration.clone();
    currIteration = iterateLSystem(lSystemIteration, lSystemParams, currIteration, 0.9, 0.9);
    currIteration.remove(oldIteration.clone());
  }

  // let heightModifier = 1;
  // let widthModifier = 1;
  // let modifiers = [];

  // while (!ruleChar.done) {
  //   if(constantsArray.includes(ruleChar.value)){
  //     if (isNewBranch) {
  //       currBranch.scale.y = heightModifier;
  //       currBranch.scale.x = -widthModifier;
  //       currBranch.scale.z = -widthModifier;
  //       let height = currBranch.geometry.parameters.height;
  //       currBranch = translateBranch(currBranch, heightModifier * height / 2);
  //       isNewBranch = false;
  //     }
  //     if(ruleChar.value == '[') {
  //       states.push(currBranch.clone());
  //       modifiers.push({
  //         heightModifier: heightModifier,
  //         widthModifier: widthModifier
  //       });
  //       isLeaf = true;
  //     } else if((ruleChar.value == ']') && (states.length > 0)) {
  //       if(isLeaf) {
  //         isLeaf = false;
  //         let leafPosition = currBranch.position;
  //         let leafCopy = leafGeometry.clone();
  //         leafCopy.translate(leafPosition.x, leafPosition.y, leafPosition.z);
  //         leafGeometries.push(leafCopy);
  //       }
  //       currBranch = states[states.length - 1].clone();
  //       heightModifier = modifiers[modifiers.length - 1].heightModifier;
  //       widthModifier = modifiers[modifiers.length - 1].widthModifier;
  //       modifiers.pop();
  //       states.pop();
  //     } else {
  //       currBranch = rotateBranch(ruleChar.value, currBranch, lSystemParams);
  //     }
  //   } else if(variablesArray.includes(ruleChar.value)) {
  //     currBranch.scale.y = heightModifier;
  //     currBranch.scale.x = - widthModifier;
  //     currBranch.scale.z = - widthModifier;
  //     widthModifier *= 0.9;
  //     heightModifier *= 0.9;
  //     let height = currBranch.geometry.parameters.height;
  //     currBranch = translateBranch(currBranch, heightModifier * height / 2);
  //     branches.push(currBranch.clone());
  //     isNewBranch = true;
  //   }
  //   ruleChar = ruleIterator.next();
  // }
  // let group = new THREE.Group();
  // branches.forEach(branch => {
  //   group.add(branch);
  // });

  // let leaves = BufferGeometryUtils.mergeGeometries(leafGeometries);
  // let combinedMesh = new THREE.Mesh(
  //   leaves,
  //   new THREE.MeshNormalMaterial()
  // );

  // group.add(combinedMesh);

  console.log(currIteration);
  return currIteration;
}

function iterateLSystem(lSystemIteration, lSystemParams, currIteration, heightModifier, widthModifier) {
//   let branchGeometry = new THREE.CylinderGeometry(1.5, 2, 30, 10);
//   let branchMaterial = new THREE.MeshLambertMaterial({ color: 0x964B00 });
//   let currBranch = new THREE.Mesh(branchGeometry, branchMaterial);
//   let currIteration = THREE.Group();
//   currIteration.add(currBranch);

  let nextIteration = new THREE.Group();
  let states = [];
  let modifiers = [];
  let isNewIteration = false;
  
  let variablesArray = lSystemParams.variables.split(',').map(variable => variable.trim());
  let constantsArray = lSystemParams.constants.split(',').map(constant => constant.trim());

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
        currIteration = translateBranch(currIteration, heightModifier * height / 2);
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
      currIteration = translateBranch(currIteration, heightModifier * height / 2);
      nextIteration.add(currIteration.clone());
      isNewIteration = true;
    }
    // if ("F" == char.value) { // need to check if this is correct
    //   currIteration.scale.y = heightModifier;
    //   currIteration.scale.x = - widthModifier;
    //   currIteration.scale.z = - widthModifier;
    //   widthModifier *= 0.9;
    //   heightModifier *= 0.9;
    //   currIteration = translateBranch(currIteration, heightModifier * height / 2);
    //   nextIteration.add(currIteration.clone());
    //   isNewIteration = true;
    // } else {
    //   if (isNewIteration) {
    //     currIteration.scale.y = heightModifier;
    //     currIteration.scale.x = -widthModifier;
    //     currIteration.scale.z = -widthModifier;
    //     currIteration = translateBranch(currIteration, heightModifier * height / 2);
    //     isNewIteration = false;
    //   }
    //   if (char.value == '[') {
    //     states.push(currIteration.clone());
    //     modifiers.push({
    //       heightModifier: heightModifier,
    //       widthModifier: widthModifier
    //     });
    //   } else if((r.value == ']') && (states.length > 0)) {
    //     currIteration = states[states.length - 1].clone();
    //     heightModifier = modifiers[modifiers.length - 1].heightModifier;
    //     widthModifier = modifiers[modifiers.length - 1].widthModifier;
    //     modifiers.pop();
    //     states.pop();
    //   } else {
    //     // try if works with nextIteration
    //     currIteration = rotateBranch(char.value, currIteration, lSystemParams);
    //   } 
    // }
    char = iterator.next();
  }
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

function translateBranch(branch, length) {
  branch.translateY(length);
  return branch;
}