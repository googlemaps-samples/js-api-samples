"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// TEST COMMENT 003
// [START maps_test_example]
// Initialize and add the map.
let map;
async function initMap() {
    // [START maps_test_example_instantiate_map]
    // The location of Uluru, Australia.
    const position = { lat: -25.344, lng: 131.031 };
    //  Request the needed libraries.
    const { Map } = await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
    // The map, centered at Uluru, Australia.
    map = new Map(document.getElementById('map'), {
        zoom: 4,
        center: position,
        mapId: 'DEMO_MAP_ID',
    });
    // [END maps_test_example_instantiate_map]
    // [START maps_test_example_instantiate_marker]
    // The marker, positioned at Uluru.
    const marker = new AdvancedMarkerElement({ map, position, title: 'Uluru' });
    // [END maps_test_example_instantiate_marker]  
}
initMap();
// [END maps_test_example]
