"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_layer_data_simple]
async function initMap() {
    (await google.maps.importLibrary('maps'));
    const mapElement = document.querySelector('gmp-map');
    let innerMap = mapElement.innerMap;
    innerMap.data.loadGeoJson('google.json');
}
initMap();
// [END maps_layer_data_simple]
