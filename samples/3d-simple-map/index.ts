/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_3d_simple_map]
async function initMap() {
    //@ts-ignore
    const { Map3DElement } = await google.maps.importLibrary('maps3d');

    // Get the gmp-map element.
    const mapElement = document.querySelector(
        'gmp-map-3d'
        //@ts-ignore
    ) as Map3DElement;

    // Get the inner map.
    const innerMap = mapElement.innerMap;

    // Set map options.
    innerMap.setOptions({
        mapTypeControl: false,
    });
}

initMap();
// [END maps_3d_simple_map]
