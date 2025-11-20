/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_add_map]
async function initMap(): Promise<void> {
    // [START maps_add_map_instantiate_map]
    // [START maps_add_map_libraries]
    //  Request the needed libraries.
    const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('maps') as Promise<google.maps.MapsLibrary>,
        google.maps.importLibrary(
            'marker'
        ) as Promise<google.maps.MarkerLibrary>,
    ]);
    // [END maps_add_map_libraries]
    // [START maps_add_map_innermap]
    // Get the gmp-map element.
    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;

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
    const marker = new AdvancedMarkerElement({
        map: innerMap,
        position: mapElement.center,
        title: 'Uluru/Ayers Rock',
    });
    // [END maps_add_map_instantiate_marker]
}
initMap();
// [END maps_add_map]
