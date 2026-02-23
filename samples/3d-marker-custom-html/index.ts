/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-nocheck
// [START maps_3d_marker_custom_html]
async function init() {
  const { Map3DElement, MarkerElement } = await google.maps.importLibrary('maps3d');

  const map = new Map3DElement({
    center: { lat: 37.424458634040455, lng: -122.0946551677331, altitude: 50 },
    tilt: 67.5,
    range: 1000,
    mode: 'SATELLITE',
  });
  document.body.append(map);

  const div = document.createElement('div');
  div.className = 'custom-marker';
  div.textContent = 'HTML marker';

  const marker = new MarkerElement({
    position: { lat: 37.424458634040455, lng: -122.0946551677331, altitude: 50 },
    title: 'Google Maps',
  });

  map.append(marker);
  marker.append(div);
}

init();
// [END maps_3d_marker_custom_html]
