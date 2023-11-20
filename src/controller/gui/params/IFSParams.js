import { preloadMengerSponge, preloadSierpinskiPyramid } from '../../../assets/preloads.js';
import { gui, fractalGUI } from '../gui.js';

let IFSParamsFolder;
let iterateCtr;
let preloadCtr;
let generateIFSButton;
let IFSPreloads;
let IFSParams = {
  type: "",
  iterate: 1,
};

export function destroyIFS() {
  IFSParamsFolder.destroy();
  generateIFSButton.destroy();
  preloadCtr.destroy();
}

export function createIFS() {
  IFSPreloads = {"Menger sponge" : preloadMengerSponge, "Sierpinski Pyramid" : preloadSierpinskiPyramid};
  preloadCtr = gui.add(fractalGUI, 'preload', IFSPreloads).name("Preload");

  IFSParamsFolder = gui.addFolder('IFS params').hide(); // not pretty

  iterateCtr = IFSParamsFolder.add(IFSParams, 'iterate', 1, 10, 1).name('Iterate');

  generateIFSButton = gui.add(fractalGUI, 'generate').name('Generate').hide();

  preloadCtr.onChange( value => {
    loadPreload(value);
  });

  return IFSParams;
}
  
function loadPreload(preload) {
  IFSParamsFolder.show();
  generateIFSButton.show();
  IFSParams.type = preload.type;
  iterateCtr.setValue(preload.iterate);
}