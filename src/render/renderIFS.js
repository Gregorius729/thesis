import * as THREE from 'three';
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

export function renderIFS(guiParams) {
  let type = guiParams.type;
  let iterate = guiParams.iterate;
  let length = 1;
  let ifs;
  
  if(type == "Menger Sponge") {
    ifs = renderMengerSponge(iterate, length);
  } else if(type == "Sierpinski Pyramid") {
    ifs = renderSierpinskiPyramid(iterate, length);
  }

  return ifs;
}

function renderMengerSponge(iterate, length) {
  let sponge = BufferGeometryUtils.mergeGeometries([new THREE.BoxGeometry(length, length, length)]);

  for (let i = 0; i < iterate; i++) {
    sponge = iterateMengerSponge(sponge, length);
    length *= 3;
  }

  let combinedMesh = new THREE.Mesh(
    sponge,
    new THREE.MeshNormalMaterial()
  );

  combinedMesh.scale.set(69 / length, 69 / length, 69 / length);
  return combinedMesh;
}

function iterateMengerSponge(oldSponge, length) {
  let newSponge;
  let sponges = [];
  for(let x = -1; x < 2; x++){
    for(let y = -1; y < 2; y++){
      for(let z = -1; z < 2; z++){
        newSponge = oldSponge.clone();
        if(((x != 0) || (y != 0)) && ((x != 0) || (z != 0)) && ((y != 0) || (z != 0))) {
          newSponge.translate(length * x, length * y, length * z);
          sponges.push(newSponge);
        }
      }
    }
  }

  newSponge = BufferGeometryUtils.mergeGeometries(sponges);
  return newSponge;
}

function renderSierpinskiPyramid(iterate, radius) {
  let length = Math.sqrt(8 / 3) * radius;
  

  let pyramid = BufferGeometryUtils.mergeGeometries([new THREE.TetrahedronGeometry(radius)]);
  pyramid.applyMatrix4( new THREE.Matrix4().makeRotationAxis( new THREE.Vector3( 1, 0, - 1 ).normalize(), Math.atan( Math.sqrt( 2 ) ) ) ); // stole this line, but i'm not even feeling bad for it tbh
  pyramid.rotateY(- Math.PI / 180 * 45);
  for (let i = 0; i < iterate; i++) {
    pyramid = iterateSierpinskiPyramid(pyramid, length);
    length *= 2;
  }

  let combinedMesh = new THREE.Mesh(
    pyramid,
    new THREE.MeshNormalMaterial()
  );
  combinedMesh.translateY(20); // not pretty

  combinedMesh.scale.set(100 / length, 100 / length, 100 / length);
  return combinedMesh;
}

function iterateSierpinskiPyramid(oldPyramid, length) {
  let newPyramid;
  let pyramids = [];
  let height = Math.sqrt(2 / 3) * length;
  let sideHeight = Math.sqrt(3) / 2 * length;

  newPyramid = oldPyramid.clone();
  newPyramid.translate(0, height / 2, 0);
  pyramids.push(newPyramid);

  newPyramid = oldPyramid.clone();
  newPyramid.translate(0, - height / 2, 2 * sideHeight / 3);
  pyramids.push(newPyramid);

  newPyramid = oldPyramid.clone();
  newPyramid.translate(length / 2, - height / 2, - sideHeight / 3);
  pyramids.push(newPyramid);

  newPyramid = oldPyramid.clone();
  newPyramid.translate(- length / 2, - height / 2, - sideHeight / 3);
  pyramids.push(newPyramid);

  newPyramid = BufferGeometryUtils.mergeGeometries(pyramids);
  return newPyramid;
}