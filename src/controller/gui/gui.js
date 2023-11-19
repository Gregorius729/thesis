import { GUI } from 'lil-gui';
import { generateFractal } from '../../main.js';
import { createLSystem, destroyLSystem } from './params/lSystemParams.js';
import { createIFS, destroyIFS } from './params/IFSParams.js';

let fractalTypesDropdown;
let fractalTypes = ["L-System", "IFS", "Limitation set"];
let currFractalType, currPreloadType;

export let fractalGUI = {
  fractalTypes: "Select one",
  preload: "Select one",
  generate: function() { generateFractal(GUIParams, currFractalType, currPreloadType) }
};

let GUIParams = {};

export const gui = new GUI();

export function addGUI() {
  currFractalType = fractalGUI.fractalTypes;
  fractalTypesDropdown = gui.add(fractalGUI, 'fractalTypes', fractalTypes).name("Fractal Type");

  fractalTypesDropdown.onChange( value => {
    fractalGUI.preload = "Select one";
    GUIParams = {};
    if(currFractalType == "L-System"){
      destroyLSystem();
    } else if (currFractalType == "IFS") {
      destroyIFS();
    }
    // else if (currFractalType == fractalTypes[2]) {
    //   limSet.destroy();
    // }
    if(value == "L-System") {
      GUIParams = createLSystem();
    } else if(value == "IFS") {
      GUIParams = createIFS();
    }
    currFractalType = value;
  } );
}