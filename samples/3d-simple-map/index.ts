/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_3d_simple_map]
async function initMap() {
    await google.maps.importLibrary('maps3d');

    // Get the gmp-map element.
    const mapElement = document.querySelector(
        'gmp-map-3d'
        //@ts-ignore
    ) as google.maps.Map3DElement;

    // Set map options.
    mapElement.setOptions({
        mapTypeControl: false,
    });
}

initMap();
// [END maps_3d_simple_map]
