/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_control_simple]
async function initMap() {
    //  Request the needed libraries.
    await google.maps.importLibrary('maps');

    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;

    const innerMap = mapElement.innerMap;

    // [START maps_control_simple_options]
    innerMap.setOptions({
        cameraControl: false,
        scaleControl: true,
    });
    // [END maps_control_simple_options]
}
initMap();
// [END maps_control_simple]
