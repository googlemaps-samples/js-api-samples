/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_layer_data_style]
async function initMap() {
    const [, { event }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('core'),
    ]);

    const mapElement = document.querySelector('gmp-map')!;

    const innerMap = mapElement.innerMap;

    // [START maps_layer_data_style_script_snippet_load]
    // Load GeoJSON.
    event.addListenerOnce(innerMap, 'idle', () => {
        innerMap.data.loadGeoJson('google.json');
    });
    // [END maps_layer_data_style_script_snippet_load]

    // [START maps_layer_data_style_script_snippet_style]
    // Set the stroke width, and fill color for each polygon
    innerMap.data.setStyle({
        fillColor: 'green',
        strokeWeight: 1,
    });
    // [END maps_layer_data_style_script_snippet_style]
}

void initMap();
// [END maps_layer_data_style]
