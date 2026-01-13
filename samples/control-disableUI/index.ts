/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_control_disableUI]
async function initMap() {
    //  Request the needed libraries.
    const [{ Map }] = await Promise.all([
        google.maps.importLibrary('maps') as Promise<google.maps.MapsLibrary>,
    ]);

    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;

    const innerMap = mapElement.innerMap;

    // [START maps_control_disableUI_options]
    innerMap.setOptions({
        // Disable the default UI.
        disableDefaultUI: true,
    });
    // [END maps_control_disableUI_options]
}

initMap();
// [END maps_control_disableUI]
