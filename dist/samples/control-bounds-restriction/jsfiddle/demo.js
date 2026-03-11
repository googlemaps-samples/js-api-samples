"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

let innerMap;
const mapElement = document.querySelector('gmp-map');

const NEW_ZEALAND_BOUNDS = {
    north: -34.36,
    south: -47.35,
    west: 166.28,
    east: -175.81,
};

async function initMap() {
    // Import the needed libraries.
    (await google.maps.importLibrary('maps'));
    innerMap = mapElement.innerMap;
    
    // Restrict the map to the provided bounds.
    innerMap.setOptions({
        restriction: {
            latLngBounds: NEW_ZEALAND_BOUNDS,
            strictBounds: false,
        }
    });
    
}
initMap();

