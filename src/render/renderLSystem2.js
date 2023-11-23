import * as THREE from 'three';

export function renderLSystem(lSystemParams) {
  let geometry = new THREE.CylinderGeometry(1.5, 2, 30, 10);
  let material = new THREE.MeshLambertMaterial({ color: 0x964B00 });
  let mesh = new THREE.Mesh(geometry, material);

  let lSystemIteration = lSystemParams.start.replaceAll(lSystemParams.variables, lSystemParams.rules[0].rule);

  let firstIteration = iterateLSystem(mesh, lSystemIteration, lSystemParams, 1, 1);

  let lSystem = new THREE.Group();
  lSystem.add(firstIteration);

  lSystem = replaceChildrenWithGroup(lSystem, 0, 3);
  lSystem = replaceChildrenWithGroup(lSystem, 0, 3);
  lSystem = replaceChildrenWithGroup(lSystem, 0, 3);
  lSystem = replaceChildrenWithGroup(lSystem, 0, 3);

  // for(let i = 0; i < lSystemParams.iterate; i++){
  //   lSystem.children.forEach(element => {
  //     newlSystem = replaceGroup(newlSystem, element);
  //     console.log(newlSystem);
  //     newlSystem = replaceGroup(newlSystem, iterateLSystem(element, lSystemIteration, lSystemParams, 1, 1));
  //   });
  //   lSystem = newlSystem.clone();
    // lSystem = iterateLSystem(lSystemIteration, lSystemParams, lSystem, 0.9, 0.9);
    // lSystem.remove(lSystem.children[0]);
    // console.log(lSystem.children[0]);
  // }

  // console.log(lSystem);
  return lSystem;
}

function replaceChildrenWithGroup(group, currIteration, iteration) {
  console.log(group.clone());
  // const childrenCopy = group.children.slice();
  let newGroup = new THREE.Group();
  newGroup = group.clone();
  let asd = newGroup.children[0].clone();
  // group.remove(...group.children);
  for (var i = 0; i < asd.children.length; i++) {
    // newGroup.position.set(Math.random() * 30, Math.random() * 30, Math.random() * 30);
    var child = asd.children[i];
    // for (var j = 0; j < child.children.length; j++) {
    //   var child2 = child.children[i];

    newGroup.position.copy(child.position);
    newGroup.rotation.copy(child.rotation);
    // newGroup.scale.set(0.3, 0.3, 0.3);
    newGroup.translateY(- child.geometry.parameters.height / 2);
    group.add(newGroup.clone());
    // group.remove(group.children[0].clone());

    // }
    // group.remove(child);
  };

  return group;
}

// function replaceChildrenWithGroup(group, currIteration, iteration) {
//   // const childrenCopy = group.children.slice();
//   // let newGroup = new THREE.Group();
//   // newGroup = group.clone();
//   let newGroup = group.children[0].clone();
//   // group.remove(group.children[0]);
//   for (var i = 0; i < newGroup.children.length; i++) {
//     // newGroup.position.set(Math.random() * 30, Math.random() * 30, Math.random() * 30);
//     var child = newGroup.children[i];
//     // for (var j = 0; j < child.children.length; j++) {
//     //   var child2 = child.children[i];
//     console.log(child);

//     newGroup.position.copy(child.position);
//     newGroup.rotation.copy(child.rotation);
//     newGroup.translateY(- child.geometry.parameters.height / 2);

//     group.add(newGroup.clone());
//     // }
//     // group.remove(child);
//   };

//   return group;
// }

// function replaceChildrenWithGroup(group, currIteration, iteration) {
//   // const childrenCopy = group.children.slice();
//   let newGroup = new THREE.Group();
//   newGroup = group.clone();
//   let asd = newGroup.children[0].clone();
//   // group.remove(...group.children);
//   for (var i = 0; i < asd.children.length; i++) {
//     // newGroup.position.set(Math.random() * 30, Math.random() * 30, Math.random() * 30);
//     var child = asd.children[i];
//     // for (var j = 0; j < child.children.length; j++) {
//     //   var child2 = child.children[i];
//     console.log(child);

//     newGroup.position.copy(child.position);
//     newGroup.rotation.copy(child.rotation);
//     newGroup.translateY(- child.geometry.parameters.height / 2);

//     group.add(newGroup.clone());
//     // }
//     // group.remove(child);
//   };

//   return group;
// }

function iterateLSystem(mesh, lSystemIteration, lSystemParams, heightModifier, widthModifier) {
  let nextIteration = new THREE.Group();
  let states = [];
  // let modifiers = [];
  let isNewIteration = false;
  
  let variablesArray = lSystemParams.variables.split(',').map(variable => variable.trim());
  let constantsArray = lSystemParams.constants.split(',').map(constant => constant.trim());

  const iterator = lSystemIteration[Symbol.iterator]();
  let char = iterator.next();

  // var groupSize = new THREE.Box3().setFromObject(mesh);
  // const size = new THREE.Vector3();
  // groupSize.getSize(size);
  
  var height = mesh.geometry.parameters.height;

  while (!char.done) {
    if (constantsArray.includes(char.value)) {
      if (isNewIteration) {
        // mesh.scale.y *= heightModifier;
        // mesh.scale.x *= widthModifier;
        // mesh.scale.z *= widthModifier;
        // widthModifier *= widthModifier;
        mesh.translateY(height / 2);
        isNewIteration = false;
      }
      if (char.value == '[') {
        states.push(mesh.clone());
        // modifiers.push({
        //   heightModifier: heightModifier,
        //   widthModifier: widthModifier
        // });
      } else if((char.value == ']') && (states.length > 0)) {
        mesh = states[states.length - 1].clone();
        // heightModifier = modifiers[modifiers.length - 1].heightModifier;
        // widthModifier = modifiers[modifiers.length - 1].widthModifier;
        // modifiers.pop();
        states.pop();
      } else {
        // try if works with nextIteration
        mesh = rotateBranch(char.value, mesh, lSystemParams);
      } 
    } else if(variablesArray.includes(char.value)) {
      // mesh.scale.y *= heightModifier;
      // mesh.scale.x *= widthModifier;
      // mesh.scale.z *= widthModifier;
      // widthModifier *= widthModifier;
      mesh.translateY(height / 2);
      nextIteration.add(mesh.clone());
      isNewIteration = true;
    }
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