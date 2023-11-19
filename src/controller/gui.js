import { GUI } from 'lil-gui';
import { preloadCurve, preloadCustom, preloadTree } from '../assets/preloads.js';
import { addTreeToScene } from '../main.js';

let lSystemParamsFolder;
let preloadCtr, variablesCtr, constantsCtr, startCtr, rulesCtr, angleCtr, iterateCtr;
let generateLSystemButton, fractalTypesDropdown;
export let branches = [];

let fractalGUI = {
  fractalTypes: "Select one",
  preload: "Select one",
  generate: function() { addTreeToScene(lSystemParams) }
};

let lSystemParams = {
  variables: "",
  constants: "+, -, &, ^, <, >, |, [, ]",
  start: "",
  rules: [],
  angle: 0,
  iterate: 1,
};

const gui = new GUI();

export function addGUI() {
  let fractalTypes = ["L-System", "IFS", "Limitation set"];
  let currFractalType = fractalGUI.fractalTypes;
  fractalTypesDropdown = gui.add(fractalGUI, 'fractalTypes', fractalTypes).name("Fractal Type");

  fractalTypesDropdown.onChange( value => {
    if(currFractalType == "L-System"){
      lSystemParamsFolder.destroy();
      generateLSystemButton.destroy();
      preloadCtr.destroy();
    }
    // } else if (currFractalType == fractalTypes[1]) {
    //   IFS.destroy();
    // } else if (currFractalType == fractalTypes[2]) {
    //   limSet.destroy();
    // }
    if(value == fractalTypes[0]) {
      createLSystem();
    }
    currFractalType = value;
  } );
}

function createLSystem(){
  let lSystemPreloads = {"Custom" : preloadCustom, "Tree" : preloadTree, "Curve" : preloadCurve};
  preloadCtr = gui.add(fractalGUI, 'preload', lSystemPreloads).name("Preload");

  lSystemParamsFolder = gui.addFolder('L-System params').hide(); // not pretty

  //TODO REAL TIME VALIDATION FOR VARIABLES AND RULES
  variablesCtr = lSystemParamsFolder.add(lSystemParams, 'variables').name('Variables');
  constantsCtr = lSystemParamsFolder.add(lSystemParams, 'constants').name('Constants').disable();
  startCtr = lSystemParamsFolder.add(lSystemParams, 'start').name('Start');
  rulesCtr = lSystemParamsFolder.addFolder( 'Rules' );
  angleCtr = lSystemParamsFolder.add(lSystemParams, 'angle', 0, 180, 1).name('Angle');
  iterateCtr = lSystemParamsFolder.add(lSystemParams, 'iterate', 1, 8, 1).name('Iterate');

  generateLSystemButton = gui.add(fractalGUI, 'generate').name('Generate').hide();

  preloadCtr.onChange( value => {
    loadPreload(value);
  });
  
  lSystemParamsFolder.onFinishChange( event => {
    changeLSystem(event);
  })
}

function changeRules(rules){
  if(rulesCtr){
    rulesCtr.controllersRecursive().forEach(rule => {
      rule.destroy();
    });
  }
  lSystemParams.rules.splice(0, lSystemParams.rules.length);
  rules.forEach(rule => {
    lSystemParams.rules.push(rule);
    rulesCtr.add(rule, 'rule').name(rule.variable);
  });
}
  
function changeLSystem(event) {
  if(event.controller == variablesCtr){
    let oldRules = []
    let newRules = [];
    let variablesArray = event.value.split(',').map(variable => variable.trim());
    rulesCtr.controllersRecursive().forEach(currRule => {
      oldRules.push({variable: currRule._name, rule: currRule.getValue()});
    });

    let newVariable = true;
    variablesArray.forEach(currVariable => {
      newVariable = true;
      oldRules.forEach(oldRule => {
        if(currVariable == oldRule.variable) {
          newVariable = false;
          newRules.push(oldRule);
        }
      });
      if(newVariable) {
        newRules.push({variable: currVariable, rule: currVariable})
      }
    });
    changeRules(newRules);
  }
}
  
function loadPreload(preload) {
  lSystemParamsFolder.show();
  generateLSystemButton.show();

  variablesCtr.setValue(preload.variables);
  constantsCtr.setValue(preload.constants);
  startCtr.setValue(preload.start);

  changeRules(preload.rules);

  angleCtr.setValue(preload.angle);
  iterateCtr.setValue(preload.iterate);
}