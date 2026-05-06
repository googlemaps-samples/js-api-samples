'use strict';
/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/*
 * This is a special sample! Having a dedicated test sample makes it easier to
 * test changes in a world where sometimes changes must be merged in order to
 * test them. This way we can avoid making changes to published content.
 * And deliver us from evil.
 */

// [START maps_test_example]
// Declare the gmp-map element.
const mapElement = document.querySelector('gmp-map');
let innerMap;
let center;

async function initMap() {
    // [START maps_test_example_instantiate_map]
    //  Request the needed libraries.
    const [, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
    ]);

    // Get the inner map from the gmp-map element.
    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
    });
    // [END maps_test_example_instantiate_map]

    // Get the lat/lng from the inner map.
    center = innerMap.getCenter();

    // [START maps_test_example_instantiate_marker]
    // Add a marker, positioned at Uluru.
    new AdvancedMarkerElement({
        map: innerMap,
        position: center,
        title: 'Uluru',
    });
    // [END maps_test_example_instantiate_marker]

    // [START maps_test_example_why_me]
    console.log("Say there Mac, why'd you choose me to test this change?");
    // [END maps_test_example_why_me]
}
void initMap();
// [END maps_test_example]
