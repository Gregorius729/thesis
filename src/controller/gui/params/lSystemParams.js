import { preloadCurve, preloadCustom, preloadTree } from '../../../assets/preloads.js';
import { gui, fractalGUI } from '../../../main.js';

let lSystemParamsFolder;
let variablesCtr, constantsCtr, startCtr, rulesCtr, anglesCtr, iterateCtr;
let geometryParamsCtr, radiusBottomCtr, radiusTopCtr, heightCtr, radialSegmentsCtr;
let treeCtr, heightModifierCtr, widthModifierCtr, ifLeafCtr, ifModifyCtr, leafLengthCtr, leafColorCtr, branchColorCtr;
let preloadCtr;
let generateLSystemButton;
let lSystemPreloads;
let lSystemParams = {
  variables: "",
  constants: "+, -, &, ^, <, >, |, [, ]",
  start: "",
  rules: [],
  angles: [],
  radiusTop: 1,
  radiusBottom: 1,
  height: 1,
  radialSegments: 1,
  iterate: 1,
  ifModify: false,
  heightModifier: 1,
  widthModifier: 1,
  ifLeaf: false,
  leafLength: 1,
  leafColor: '#000000',
  branchColor: '#964B00',
};

export function destroyLSystem() {
  lSystemParamsFolder.destroy();
  generateLSystemButton.destroy();
  preloadCtr.destroy();
}

export function createLSystem() {
  lSystemPreloads = {"Custom" : preloadCustom, "Tree" : preloadTree, "Curve" : preloadCurve};
  preloadCtr = gui.add(fractalGUI, 'preload', lSystemPreloads).name("Preload");

  lSystemParamsFolder = gui.addFolder('L-System params').hide(); // not pretty

  geometryParamsCtr = lSystemParamsFolder.addFolder( 'Geometry params' ).close();
  radiusTopCtr = geometryParamsCtr.add(lSystemParams, 'radiusTop', 1, 10, 0.5).name('Top radius');
  radiusBottomCtr = geometryParamsCtr.add(lSystemParams, 'radiusBottom', 1, 10, 0.5).name('Bottom radius');
  heightCtr = geometryParamsCtr.add(lSystemParams, 'height', 2, 100, 2).name('Height');
  radialSegmentsCtr = geometryParamsCtr.add(lSystemParams, 'radialSegments', 2, 10, 1).name('Radial segments');
    
  variablesCtr = lSystemParamsFolder.add(lSystemParams, 'variables').name('Variables');
  constantsCtr = lSystemParamsFolder.add(lSystemParams, 'constants').name('Constants');
  startCtr = lSystemParamsFolder.add(lSystemParams, 'start').name('Start');
  
  rulesCtr = lSystemParamsFolder.addFolder( 'Rules' );
  anglesCtr = lSystemParamsFolder.addFolder( 'Angles' ).close();
  
  branchColorCtr = lSystemParamsFolder.addColor(lSystemParams, 'branchColor').name('Branch color');
  
  treeCtr = lSystemParamsFolder.addFolder('Tree').close();
  ifModifyCtr = treeCtr.add(lSystemParams, 'ifModify').name('Modify');
  heightModifierCtr = treeCtr.add(lSystemParams, 'heightModifier', 0.75, 0.99, 0.01).name('Height modifier');
  widthModifierCtr = treeCtr.add(lSystemParams, 'widthModifier', 0.75, 0.99, 0.01).name('Width modifier');
  ifLeafCtr = treeCtr.add(lSystemParams, 'ifLeaf').name('Leaf');
  leafLengthCtr = treeCtr.add(lSystemParams, 'leafLength', 1, 20, 1).name('Leaf length');
  leafColorCtr = treeCtr.addColor(lSystemParams, 'leafColor').name('Leaf color');

  iterateCtr = lSystemParamsFolder.add(lSystemParams, 'iterate', 1, 6, 1).name('Iterate');
  
  generateLSystemButton = gui.add(fractalGUI, 'generate').name('Generate').hide();

  preloadCtr.onChange( value => {
    loadPreload(value);
  });
  
  lSystemParamsFolder.onFinishChange( event => {
    changeLSystem(event);
  });

  return lSystemParams;
}

function changeRules(rules){
  rulesCtr.controllersRecursive().forEach(rule => {
    rule.destroy();
  });
  lSystemParams.rules.splice(0, lSystemParams.rules.length);
  rules.forEach(rule => {
    lSystemParams.rules.push(rule);
    rulesCtr.add(rule, 'rule').name(rule.variable);
  });
}

function changeAngles(angles){
  anglesCtr.controllersRecursive().forEach(angle => {
    angle.destroy();
  });
  lSystemParams.angles.splice(0, lSystemParams.angles.length);
  angles.forEach(angle => {
    lSystemParams.angles.push(angle);
    anglesCtr.add(angle, 'angle', 0, 180, 1).name(angle.axis);
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
  changeAngles(preload.angles);

  radiusBottomCtr.setValue(preload.radiusBottom);
  radiusTopCtr.setValue(preload.radiusTop);
  heightCtr.setValue(preload.height);
  radialSegmentsCtr.setValue(preload.radialSegments);

  iterateCtr.setValue(preload.iterate);

  ifModifyCtr.setValue(preload.ifModify);
  heightModifierCtr.setValue(preload.heightModifier);
  widthModifierCtr.setValue(preload.widthModifier);
  ifLeafCtr.setValue(preload.ifLeaf);
  leafLengthCtr.setValue(preload.leafLength);
  leafColorCtr.setValue(preload.leafColor);

  branchColorCtr.setValue(preload.branchColor);
}