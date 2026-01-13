/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_control_simple]
async function initMap() {
    //  Request the needed libraries.
    const [{ Map }] = await Promise.all([
        google.maps.importLibrary('maps') as Promise<google.maps.MapsLibrary>,
    ]);

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
