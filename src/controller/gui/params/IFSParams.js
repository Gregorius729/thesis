import { preloadMengerSponge } from '../../../assets/preloads.js';
import { gui, fractalGUI } from '../gui.js';

let IFSParamsFolder;
let iterateCtr;
let preloadCtr;
let generateIFSButton;
let IFSPreloads;
let IFSParams = {
  iterate: 1,
};

export function destroyIFS() {
  IFSParamsFolder.destroy();
  generateIFSButton.destroy();
  preloadCtr.destroy();
}

export function createIFS() {
  IFSPreloads = {"Menger sponge" : preloadMengerSponge};
  preloadCtr = gui.add(fractalGUI, 'preload', IFSPreloads).name("Preload");

  IFSParamsFolder = gui.addFolder('IFS params').hide(); // not pretty

  //TODO REAL TIME VALIDATION FOR VARIABLES AND RULES
  iterateCtr = IFSParamsFolder.add(IFSParams, 'iterate', 1, 8, 1).name('Iterate');

  generateIFSButton = gui.add(fractalGUI, 'generate').name('Generate').hide();

  preloadCtr.onChange( value => {
    loadPreload(value);
  });

  return IFSParams;
}
  
function loadPreload(preload) {
  IFSParamsFolder.show();
  generateIFSButton.show();
  iterateCtr.setValue(preload.iterate);
}