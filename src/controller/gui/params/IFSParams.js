import { preloadMengerSponge, preloadSierpinskiPyramid } from '../../../assets/preloads.js';
import { gui, fractalGUI } from '../../../main.js';

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
  IFSPreloads = {"Menger Sponge" : preloadMengerSponge, "Sierpinski Pyramid" : preloadSierpinskiPyramid};
  preloadCtr = gui.add(fractalGUI, 'preload', IFSPreloads).name("Preload");

  IFSParamsFolder = gui.addFolder('Params').hide(); // not pretty

  generateIFSButton = gui.add(fractalGUI, 'generate').name('Generate').hide();

  preloadCtr.onChange( value => {
    loadPreload(value);
  });

  return IFSParams;
}
 
function changeIterateCtr(ifsType) {
  if (ifsType == "Menger Sponge") {
  iterateCtr = IFSParamsFolder.add(IFSParams, 'iterate', 1, 4, 1).name('Iterate');
  } else if (ifsType == "Sierpinski Pyramid") {
    iterateCtr = IFSParamsFolder.add(IFSParams, 'iterate', 1, 9, 1).name('Iterate');
  }
}

function loadPreload(preload) {
  IFSParamsFolder.show();
  generateIFSButton.show();
  IFSParams.type = preload.type;
  if(iterateCtr) {
    iterateCtr.destroy();
  }
  changeIterateCtr(preload.type);
  iterateCtr.setValue(preload.iterate);
}