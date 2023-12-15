import { createLSystem, destroyLSystem } from './params/lSystemParams.js';
import { createIFS, destroyIFS } from './params/IFSParams.js';
import { gui, fractalGUI } from '../../main.js';

let fractalTypesDropdown;
let fractalTypes = ["L-System", "Other"];
export let currFractalType;

export let GUIParams = {};

export function addGUI() {
  currFractalType = fractalGUI.fractalTypes;
  
  fractalTypesDropdown = gui.add(fractalGUI, 'fractalTypes', fractalTypes).name("Fractal Type");

  fractalTypesDropdown.onChange( value => {
    fractalGUI.preload = "Select one";
    GUIParams = {};
    if(currFractalType == "L-System"){
      destroyLSystem();
    } else if (currFractalType == "Other") {
      destroyIFS();
    }
    if(value == "L-System") {
      GUIParams = createLSystem();
    } else if(value == "Other") {
      GUIParams = createIFS();
    }
    currFractalType = value;
  } );
}