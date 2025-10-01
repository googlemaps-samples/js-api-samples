/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_layer_data_quakes_simple]
let innerMap;
let earthquakeData;

async function initMap() {
  (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;

  const mapElement = document.querySelector(
    "gmp-map"
  ) as google.maps.MapElement;

  innerMap = mapElement.innerMap;

  if (earthquakeData) {
    innerMap.data.addGeoJson(earthquakeData);
  }
}

// Defines the callback function referenced in the jsonp file.
function eqfeed_callback(data: any) {
  if (innerMap) {
    innerMap.data.addGeoJson(data);
  } else {
    earthquakeData = data;
  }
}

window.eqfeed_callback = eqfeed_callback;

initMap();
// [END maps_layer_data_quakes_simple]
