"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_layer_data_event]
let map;
async function initMap() {
    (await google.maps.importLibrary('maps'));
    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;
    // Load GeoJSON.
    innerMap.data.loadGeoJson('google.json');
    // Add some style.
    innerMap.data.setStyle((feature) => {
        return /** @type {google.maps.Data.StyleOptions} */ {
            fillColor: feature.getProperty('color'),
            strokeWeight: 1,
        };
    });
    // [START maps_layer_data_event_snippet]
    // Set mouseover event for each feature.
    innerMap.data.addListener('mouseover', (event) => {
        document.getElementById('info-box').textContent =
            event.feature.getProperty('letter');
    });
    // [END maps_layer_data_event_snippet]
}
initMap();
// [END maps_layer_data_event]
