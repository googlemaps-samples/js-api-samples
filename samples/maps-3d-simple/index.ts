/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_map_3d_simple]
const map = document.querySelector('gmp-3d-map') as any;
async function initMap(): Promise<void> {
  //@ts-ignore
  const { Map3DElement, Marker3DInteractiveElement, PopoverElement } = await google.maps.importLibrary("maps3d") as google.maps.Maps3DLibrary;
  
  const map = new Map3DElement({
    center: { lat: 37.7704, lng: -122.3985, altitude: 500 },
    tilt: 67.5,
    //@ts-ignore
    mode: 'HYBRID',
  });

  document.body.append(map);
}

initMap();
// [END maps_map_3d_simple]