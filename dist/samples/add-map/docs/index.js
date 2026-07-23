'use strict';
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_add_map]
async function init() {
    // [START maps_add_map_instantiate_map]
    // [START maps_add_map_libraries]
    // Request the needed libraries.
    const [{ AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('maps'),
    ]);
    // [END maps_add_map_libraries]
    // [START maps_add_map_innermap]
    // Get the gmp-map element.
    const mapElement = document.querySelector('gmp-map');

    // Get the inner map.
    const innerMap = mapElement.innerMap;

    // Set map options.
    innerMap.setOptions({
        mapTypeControl: false,
    });
    // [END maps_add_map_innermap]
    // [END maps_add_map_instantiate_map]

    // [START maps_add_map_instantiate_marker]
    // Add a marker positioned at the map center (Uluru).
    new AdvancedMarkerElement({
        map: innerMap,
        position: mapElement.center,
        title: 'Uluru/Ayers Rock',
    });
    // [END maps_add_map_instantiate_marker]
}
void init();
// [END maps_add_map]
