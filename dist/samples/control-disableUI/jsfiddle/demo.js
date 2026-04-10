"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function initMap() {
    //  Request the needed libraries.
    await google.maps.importLibrary('maps');
    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;
    
    innerMap.setOptions({
        // Disable the default UI.
        disableDefaultUI: true,
    });
    
}
initMap();

