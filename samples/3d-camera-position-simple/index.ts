/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_camera_position_simple]
async function init() {
  const { Map3DElement, Marker3DElement } = await google.maps.importLibrary('maps3d') as any;

  const locations = {
    eiffelTower: { lat: 48.85835039084429, lng: 2.294765331382789 },
    statueOfLiberty: { lat: 40.68926261007058, lng: -74.04455041234453 }
  };

  const fmt = (p: any) => p ? `{ lat: ${p.lat.toFixed(5)}, lng: ${p.lng.toFixed(5)}, alt: ${Math.round(p.altitude || 0)} }` : 'null';

  // --- MAP 1: Scenario - View FROM a specific vantage point ---
  const mapCamera = new Map3DElement({
    mode: 'SATELLITE',
    cameraPosition: { lat: 48.84752, lng: 2.29364, altitude: 330 },
    heading: 3,
    tilt: 80
  });

  document.getElementById('map-camera')?.append(mapCamera);
  mapCamera.append(new Marker3DElement({
    position: { ...locations.eiffelTower, altitude: 100 },
    altitudeMode: 'RELATIVE_TO_MESH',
    label: 'Eiffel Tower',
    extruded: true,
  }));

  const settingsCamera = document.getElementById('settings-camera');
  const updateSettingsCamera = () => {
    if (settingsCamera) {
      settingsCamera.innerText = `[EXPLICITLY SET]
map.cameraPosition: ${fmt(mapCamera.cameraPosition)}
map.heading: ${Math.round(mapCamera.heading)}°
map.tilt: ${Math.round(mapCamera.tilt)}°`;
    }
  };
  mapCamera.addEventListener('gmp-steadychange', updateSettingsCamera);
  updateSettingsCamera();


  // --- MAP 2: Scenario - Focus ON a point from a distance ---
  const mapCenter = new Map3DElement({
    mode: 'SATELLITE',
    center: { ...locations.statueOfLiberty, altitude: 50 },
    heading: -110,
    tilt: 80,
    range: 300
  });

  document.getElementById('map-center')?.append(mapCenter);
  mapCenter.append(new Marker3DElement({
    position: { ...locations.statueOfLiberty, altitude: 40 },
    altitudeMode: 'RELATIVE_TO_MESH',
    label: 'Statue of Liberty',
    extruded: true,
  }));

  const settingsCenter = document.getElementById('settings-center');
  const updateSettingsCenter = () => {
    if (settingsCenter) {
      settingsCenter.innerText = `[EXPLICITLY SET]
map.center: ${fmt(mapCenter.center)}
map.range: ${Math.round(mapCenter.range)}m
map.heading: ${Math.round(mapCenter.heading)}°
map.tilt: ${Math.round(mapCenter.tilt)}°`;
    }
  };
  mapCenter.addEventListener('gmp-steadychange', updateSettingsCenter);
  updateSettingsCenter();
}

init();
// [END maps_3d_camera_position_simple]
