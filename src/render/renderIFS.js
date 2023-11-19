import * as THREE from 'three';

export function renderIFS(IFSParams) {
  let branchGeometry = new THREE.BoxGeometry(5, 5, 5);
  let branchMaterial = new THREE.MeshLambertMaterial({ color: 0x964B00 });
  let sponge = new THREE.Mesh(branchGeometry, branchMaterial);
  let length = sponge.geometry.parameters.height;

  for(let i = 0; i < IFSParams.iterate; i++) {
    sponge = makeMengerSponge(sponge, length);
  }

  return sponge;
}

function mergeCubes(cubes) {
  const combinedObject = new THREE.Object3D();
  console.log("merged");
  cubes.forEach(cube => {
    combinedObject.add(cube);
  });

  return combinedObject;
}

function makeMengerSponge(cube, length) {
  let cubes = [];
  for(let x = -1; x < 2; x++){
    for(let y = -1; y < 2; y++){
      for(let z = -1; z < 2; z++){
        let newCube = cube.clone();
        newCube.position.copy(cube.position);
        if(((x != 0) || (y != 0)) && ((x != 0) || (z != 0)) && ((y != 0) || (z != 0))) {
          newCube.position.set(length * x, length * y, length * z);
          cubes.push(newCube);
          console.log("object");
        }
      }
    }
  }

  let nextIteration = mergeCubes(cubes);

  return nextIteration;
}