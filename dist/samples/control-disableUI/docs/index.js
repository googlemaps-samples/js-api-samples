"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_control_disableUI]
async function initMap() {
    //  Request the needed libraries.
    await google.maps.importLibrary('maps');
    const mapElement = document.querySelector('gmp-map');
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
