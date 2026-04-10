'use strict';
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_layer_data_simple]
let innerMap;
async function initMap() {
    await google.maps.importLibrary('maps');
    const mapElement = document.querySelector('gmp-map');
    innerMap = mapElement.innerMap;
    // Load the geojson data
    const script = document.createElement('script');
    script.setAttribute('src', 'google.json');
    document.getElementsByTagName('head')[0].appendChild(script);
}
// Defines the callback function referenced in the jsonp file.
function eqfeed_callback(data) {
    innerMap.data.addGeoJson(data);
}
window.eqfeed_callback = eqfeed_callback;
initMap();
// [END maps_layer_data_simple]
