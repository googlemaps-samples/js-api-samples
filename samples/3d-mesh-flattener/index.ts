/**
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_mesh_flattener]
let map3DElement: any = null;
let model3DElement: any = null;

let flattenerModel: any = null;
let flattenerRing: any = null;
let flattenerCircle: any = null;
let flattenerOverlap: any = null;

let polygonModel: any = null;
let polygonRing: any = null;
let polygonCircleBorder: any = null;
let polygonCircleFill: any = null;
let polygonABorder: any = null;
let polygonBBorder: any = null;
let polygonXORFill: any = null;

let hasModelStarted = false;

function showFeedback(text: string, duration: number = 3000): void {
  const feedback = document.getElementById('feedback');
  if (feedback) {
    feedback.innerText = text;
    feedback.style.opacity = '1';
    if (duration > 0) {
      setTimeout(() => {
        if (feedback.innerText === text) feedback.style.opacity = '0.7';
      }, duration);
    }
  }
}

async function loadModelAfterSettle(): Promise<void> {
  if (hasModelStarted) return;
  hasModelStarted = true;

  showFeedback('3D Map Steady. Waiting...', 500);

  await new Promise((resolve) => setTimeout(resolve, 500));

  showFeedback('Loading 3D model...', 500);

  // [START maps_3d_mesh_flattener_append_model]
  map3DElement.append(model3DElement);
  // [END maps_3d_mesh_flattener_append_model]

  (document.getElementById('toggle-model-3d') as HTMLElement).classList.add('active');
  setTimeout(() => showFeedback('Flattener + Model', 2000), 500);
}

async function initialize(): Promise<void> {
  showFeedback('Loading Google 3D Library...', 0);
  const { Map3DElement, Model3DElement, FlattenerElement, Polygon3DElement } =
    (await google.maps.importLibrary('maps3d')) as any;

  showFeedback('Initializing Core Engine...', 0);
  map3DElement = new Map3DElement({
    center: { lat: 40.70304023274898, lng: -73.99453903360259, altitude: 397.3687221767566 },
    heading: -54.63577922139952,
    tilt: 65.59195953953744,
    mode: 'SATELLITE',
  });

  (document.body.querySelector('#canvas-container') as HTMLElement).append(map3DElement);
  showFeedback('Awaiting Camera Settle...', 0);

  // 1. FLATTENER MODEL
  const pathModel = [
    { lat: 40.707680607935245, lng: -74.00310353377735, altitude: 500 },
    { lat: 40.70829665151717, lng: -74.00193595590612, altitude: 500 },
    { lat: 40.7073748659931, lng: -74.00122787224885, altitude: 500 },
    { lat: 40.706738652153156, lng: -74.00232125268805, altitude: 500 },
    { lat: 40.70738164589913, lng: -74.0028721484274, altitude: 500 },
  ];

  flattenerModel = new FlattenerElement({ path: pathModel });
  polygonModel = new Polygon3DElement({
    path: pathModel,
    strokeWidth: 1,
    strokeColor: 'rgba(0, 0, 0, 0.5)',
    fillColor: 'rgba(0, 0, 0, 0.5)',
  });

  // 2. FLATTENER HOLE (From GeoJSON)
  const pathRing = [
    { lat: 40.70525492092921, lng: -74.0047826089383, altitude: 500 },
    { lat: 40.70727402965653, lng: -74.00749574990328, altitude: 500 },
    { lat: 40.70798885471939, lng: -74.00867034141844, altitude: 500 },
    { lat: 40.708653509735655, lng: -74.00948097499938, altitude: 500 },
    { lat: 40.70770041711879, lng: -74.01019234718768, altitude: 500 },
    { lat: 40.70833999370507, lng: -74.01125113390576, altitude: 500 },
    { lat: 40.70497901277918, lng: -74.01406353612529, altitude: 500 },
    { lat: 40.70420144825607, lng: -74.01431168926244, altitude: 500 },
    { lat: 40.70318558415431, lng: -74.01446058114452, altitude: 500 },
    { lat: 40.70255849981402, lng: -74.01406353612529, altitude: 500 },
    { lat: 40.70237037336145, lng: -74.01356722985155, altitude: 500 },
    { lat: 40.70242054046693, lng: -74.01288894461015, altitude: 500 },
    { lat: 40.70193140956982, lng: -74.01264079147302, altitude: 500 },
    { lat: 40.701465859141024, lng: -74.01248971734611, altitude: 500 },
    { lat: 40.70233187033904, lng: -74.00909060361744, altitude: 500 },
    { lat: 40.70525492092921, lng: -74.0047826089383, altitude: 500 }
  ];
  const innerPathsRing = [[
    { lat: 40.70499320013363, lng: -74.01151456176834, altitude: 500 },
    { lat: 40.7034935749941, lng: -74.01157028494391, altitude: 500 },
    { lat: 40.70368367019097, lng: -74.01070657571772, altitude: 500 },
    { lat: 40.704523527653194, lng: -74.00956186128388, altitude: 500 },
    { lat: 40.70489802785991, lng: -74.00885045950898, altitude: 500 },
    { lat: 40.70523558310976, lng: -74.0082050053636, altitude: 500 },
    { lat: 40.70541940258585, lng: -74.00805838813739, altitude: 500 },
    { lat: 40.70534584799336, lng: -74.00875300309274, altitude: 500 },
    { lat: 40.70499320013363, lng: -74.01151456176834, altitude: 500 }
  ]];
  flattenerRing = new FlattenerElement({ path: pathRing, innerPaths: innerPathsRing });
  polygonRing = new Polygon3DElement({
    path: pathRing,
    innerPaths: innerPathsRing,
    strokeWidth: 1,
    strokeColor: 'rgba(0, 255, 0, 0.5)',
    fillColor: 'rgba(0, 0, 0, 0)',
  });

  // 3. OVERLAPPING POLYGONS A & B (STRICT GEOJSON PATHS)
  const pathA = [
    { lat: 40.71209282996574, lng: -73.99697908922529, altitude: 500 },
    { lat: 40.711794676757876, lng: -73.99968173492475, altitude: 500 },
    { lat: 40.7105531428337, lng: -74.00092514227472, altitude: 500 },
    { lat: 40.71021379199394, lng: -74.00109125068442, altitude: 500 }, // RESTORED POINT
    { lat: 40.71012596267241, lng: -74.00097399581963, altitude: 500 },
    { lat: 40.70871587271108, lng: -73.99920324440114, altitude: 500 },
    { lat: 40.70920322327643, lng: -73.99623454119144, altitude: 500 },
    { lat: 40.71209282996574, lng: -73.99697908922529, altitude: 500 }
  ];
  const pathB = [
    { lat: 40.71113368382996, lng: -73.99834379245007, altitude: 500 },
    { lat: 40.71099671827392, lng: -73.99841155170458, altitude: 500 },
    { lat: 40.70965272880804, lng: -73.99802758259297, altitude: 500 },
    { lat: 40.70959280507873, lng: -73.99793723691928, altitude: 500 },
    { lat: 40.709567123464325, lng: -73.99780171840952, altitude: 500 },
    { lat: 40.70978969712857, lng: -73.99642394688965, altitude: 500 },
    { lat: 40.709755455074685, lng: -73.99631101479754, altitude: 500 },
    { lat: 40.71008075387488, lng: -73.99407495938, altitude: 500 },
    { lat: 40.71056013868292, lng: -73.99413142542642, altitude: 500 },
    { lat: 40.71159594050232, lng: -73.99423306430893, altitude: 500 },
    { lat: 40.71138193318234, lng: -73.99676274316519, altitude: 500 },
    { lat: 40.71113368382996, lng: -73.99834379245007, altitude: 500 }
  ];

  // Invisible Flattener for XOR Ground Behavior
  flattenerOverlap = new FlattenerElement({ path: [...pathA, ...pathB] });

  // High-performance separate Borders
  polygonABorder = new Polygon3DElement({
    path: pathA, strokeWidth: 2, strokeColor: 'rgba(0,0,0,0.7)', fillColor: 'rgba(0,0,0,0)'
  });
  polygonBBorder = new Polygon3DElement({
    path: pathB, strokeWidth: 2, strokeColor: 'rgba(0,0,0,0.7)', fillColor: 'rgba(0,0,0,0)'
  });

  // Unified Fill for XOR Visual Behavior (Math XOR handles exclusion area)
  polygonXORFill = new Polygon3DElement({
    path: [...pathA, ...pathB], strokeWidth: 0, fillColor: 'rgba(0,0,0,0.4)', strokeColor: 'transparent'
  });

  // 4. SEPARATE CIRCLE
  const pathCircle = [
    { lat: 40.71425236440663, lng: -74.0031702392633, altitude: 500 },
    { lat: 40.71424560043059, lng: -74.00335188313005, altitude: 500 },
    { lat: 40.71422537364735, lng: -74.00353177755721, altitude: 500 },
    { lat: 40.714191878864035, lng: -74.00370818995754, altitude: 500 },
    { lat: 40.71414543867344, lng: -74.00387942128583, altitude: 500 },
    { lat: 40.71408650034651, lng: -74.00404382240546, altitude: 500 },
    { lat: 40.71401563152389, lng: -74.0041998099738, altitude: 500 },
    { lat: 40.713933514747985, lng: -74.00434588169324, altitude: 500 },
    { lat: 40.713840940888254, lng: -74.00448063078125, altitude: 500 },
    { lat: 40.71373880152319, lng: -74.00460275951964, altitude: 500 },
    { lat: 40.71362808035234, lng: -74.00471109175272, altitude: 500 },
    { lat: 40.713509843721155, lng: -74.00480458421391, altitude: 500 },
    { lat: 40.71338523034988, lng: -74.00488233657175, altitude: 500 },
    { lat: 40.71325544036575, lng: -74.0049436000985, altitude: 500 },
    { lat: 40.71312172374378, lng: -74.00498778487827, altitude: 500 },
    { lat: 40.71298536826787, lng: -74.00501446548478, altitude: 500 },
    { lat: 40.71284768712793, lng: -74.00502338507482, altitude: 500 },
    { lat: 40.71271000627269, lng: -74.00501445785768, altitude: 500 },
    { lat: 40.71257365163994, lng: -74.00498776991721, altitude: 500 },
    { lat: 40.71243993638719, lng: -74.0049435783784, altitude: 500 },
    { lat: 40.71231014824573, lng: -74.0048823089273, altitude: 500 },
    { lat: 40.71218553711975, lng: -74.0048045517075, altitude: 500 },
    { lat: 40.71206730305018, lng: -74.00471105563352, altitude: 500 },
    { lat: 40.71195658465887, lng: -74.00460272117569, altitude: 500 },
    { lat: 40.71185444818443, lng: -74.0044805916861, altitude: 500 },
    { lat: 40.71176187721532, lng: -74.00434588169324, altitude: 500 },
    { lat: 40.71167976321895, lng: -74.00419977385458, altitude: 500 },
    { lat: 40.71160889695797, lng: -74.00404378989903, altitude: 500 },
    { lat: 40.71154996087633, lng: -74.00387939364138, altitude: 500 },
    { lat: 40.711503522528396, lng: -74.00370816823745, altitude: 500 },
    { lat: 40.7114700291143, lng: -74.00353176259617, altitude: 500 },
    { lat: 40.711449803174226, lng: -74.00335187550297, altitude: 500 },
    { lat: 40.71144303948289, lng: -74.0031702392633, altitude: 500 },
    { lat: 40.711449803174226, lng: -74.00298860302364, altitude: 500 },
    { lat: 40.7114700291143, lng: -74.00280871593044, altitude: 500 },
    { lat: 40.711503522528396, lng: -74.00263231028916, altitude: 500 },
    { lat: 40.71154996087633, lng: -74.00246108488521, altitude: 500 },
    { lat: 40.71160889695797, lng: -74.00229668862757, altitude: 500 },
    { lat: 40.71167976321895, lng: -74.00214070467202, altitude: 500 },
    { lat: 40.71176187721532, lng: -74.00199463517733, altitude: 500 },
    { lat: 40.71185444818443, lng: -74.0018598868405, altitude: 500 },
    { lat: 40.71195658465887, lng: -74.00173775735091, altitude: 500 },
    { lat: 40.71206730305018, lng: -74.00162942289309, altitude: 500 },
    { lat: 40.71218553711975, lng: -74.0015359268191, altitude: 500 },
    { lat: 40.71231014824573, lng: -74.0014581695993, altitude: 500 },
    { lat: 40.71243993638719, lng: -74.0013969001482, altitude: 500 },
    { lat: 40.71257365163994, lng: -74.00135270860939, altitude: 500 },
    { lat: 40.71271000627269, lng: -74.00132602066891, altitude: 500 },
    { lat: 40.71284768712793, lng: -74.00131709345177, altitude: 500 },
    { lat: 40.71298536826787, lng: -74.00132601304183, altitude: 500 },
    { lat: 40.71312172374378, lng: -74.00135269364834, altitude: 500 },
    { lat: 40.71325544036575, lng: -74.0013968784281, altitude: 500 },
    { lat: 40.71338523034988, lng: -74.00145814195486, altitude: 500 },
    { lat: 40.713509843721155, lng: -74.00153589431268, altitude: 500 },
    { lat: 40.71362808035234, lng: -74.00162938677389, altitude: 500 },
    { lat: 40.71373880152319, lng: -74.00173771900695, altitude: 500 },
    { lat: 40.713840940888254, lng: -74.00185984774535, altitude: 500 },
    { lat: 40.713933514747985, lng: -74.00199459683336, altitude: 500 },
    { lat: 40.71401563152389, lng: -74.0021406685528, altitude: 500 },
    { lat: 40.71408650034651, lng: -74.00229665612115, altitude: 500 },
    { lat: 40.71414543867344, lng: -74.00246105724078, altitude: 500 },
    { lat: 40.714191878864035, lng: -74.00263228856906, altitude: 500 },
    { lat: 40.71422537364735, lng: -74.00280870096938, altitude: 500 },
    { lat: 40.71424560043059, lng: -74.00298859539656, altitude: 500 },
    { lat: 40.71425236440663, lng: -74.0031702392633, altitude: 500 }
  ];
  flattenerCircle = new FlattenerElement({ path: pathCircle });
  polygonCircleFill = new Polygon3DElement({
    path: pathCircle, strokeWidth: 0, fillColor: 'rgba(0, 0, 0, 0.4)'
  });
  polygonCircleBorder = new Polygon3DElement({
    path: pathCircle, strokeWidth: 2, strokeColor: 'rgba(0, 0, 0, 0.7)', fillColor: 'rgba(0, 0, 0, 0)'
  });

  // [START maps_3d_mesh_flattener_create_model]
  model3DElement = new Model3DElement({
    src: './models/building2.glb',
    altitudeMode: 'RELATIVE_TO_GROUND',
    position: { lat: 40.707550741876865, lng: -74.00219608291567, altitude: 5 },
    scale: 3,
    orientation: { heading: 325, tilt: -90 },
  });
  // [END maps_3d_mesh_flattener_create_model]

  showFeedback('Applying Flattener Model...', 500);
  map3DElement.append(flattenerModel, polygonModel);
  (document.getElementById('toggle-flattener-element-model') as HTMLElement).classList.add('active');

  map3DElement.addEventListener('gmp-steadychange', loadModelAfterSettle);

  const modeCheckbox = document.getElementById('mode-checkbox') as HTMLInputElement;
  modeCheckbox.addEventListener('change', () => {
    map3DElement.mode = modeCheckbox.checked ? 'HYBRID' : 'SATELLITE';
    showFeedback(`Mode: ${map3DElement.mode}`);
  });

  (document.getElementById('toggle-flattener-element-intersect') as HTMLElement).addEventListener('click', (e) => {
    if (flattenerRing.isConnected) {
      polygonRing.remove(); flattenerRing.remove();
      (e.target as HTMLElement).classList.remove('active');
      showFeedback('Flattener Hole removed');
    } else {
      map3DElement.append(flattenerRing, polygonRing);
      (e.target as HTMLElement).classList.add('active');
      showFeedback('Flattener Hole added');
    }
  });

  (document.getElementById('toggle-flattener-element-union') as HTMLElement).addEventListener('click', (e) => {
    if (flattenerOverlap.isConnected) {
      polygonABorder.remove(); polygonBBorder.remove(); polygonXORFill.remove(); flattenerOverlap.remove();
      polygonCircleBorder.remove(); polygonCircleFill.remove(); flattenerCircle.remove();
      (e.target as HTMLElement).classList.remove('active');
      showFeedback('Flattener Multi-Hole removed');
    } else {
      map3DElement.append(flattenerOverlap, polygonABorder, polygonBBorder, polygonXORFill);
      map3DElement.append(flattenerCircle, polygonCircleBorder, polygonCircleFill);
      (e.target as HTMLElement).classList.add('active');
      showFeedback('Flattener Multi-Hole added');
    }
  });

  (document.getElementById('toggle-flattener-element-model') as HTMLElement).addEventListener('click', (e) => {
    if (flattenerModel.isConnected) {
      polygonModel.remove(); flattenerModel.remove();
      (e.target as HTMLElement).classList.remove('active');
      showFeedback('Flattener Model removed');
    } else {
      map3DElement.append(flattenerModel, polygonModel);
      (e.target as HTMLElement).classList.add('active');
      showFeedback('Flattener Model added');
    }
  });

  (document.getElementById('toggle-model-3d') as HTMLElement).addEventListener('click', (e) => {
    if (model3DElement.isConnected) {
      model3DElement.remove();
      (e.target as HTMLElement).classList.remove('active');
      showFeedback('3D Model removed');
    } else {
      map3DElement.append(model3DElement);
      (e.target as HTMLElement).classList.add('active');
      showFeedback('3D Model added');
    }
  });
}

initialize();
// [END maps_3d_mesh_flattener]
