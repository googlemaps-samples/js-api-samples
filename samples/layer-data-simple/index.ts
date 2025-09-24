/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_layer_data_simple]
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;
let innerMap;

async function initMap() {
  await google.maps.importLibrary('maps') as google.maps.MapsLibrary;

    innerMap = mapElement.innerMap;

    google.maps.event.addListenerOnce(innerMap, 'idle', () => {
      innerMap.data.loadGeoJson(
         'google.json'
      );
    });
}

initMap();
// [END maps_layer_data_simple]
