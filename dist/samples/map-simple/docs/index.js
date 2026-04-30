"use strict";
/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_map_simple]
async function initMap() {
    // Import the needed libraries.
    await google.maps.importLibrary('maps');
    // Create the map.
    const mapElement = document.querySelector('gmp-map');
    // Access the underlying map object.
    const innerMap = mapElement.innerMap;
}
initMap();
// [END maps_map_simple]
