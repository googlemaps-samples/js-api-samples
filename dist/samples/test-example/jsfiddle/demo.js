"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/*
 * This is a special sample! Having a dedicated test sample makes it easier to
 * test changes in a world where sometimes changes must be merged in order to
 * test them. This way we can avoid making changes to published content.
 */
// TEST COMMENT 007

// Declare the gmp-map element.
const mapElement = document.querySelector('gmp-map');
let innerMap;
const advancedMarkerElement = document.querySelector('gmp-advanced-marker');
let center;
async function initMap() {
    
    //  Request the needed libraries.
    const { Map } = (await google.maps.importLibrary('maps'));
    const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker'));
    // Get the inner map from the gmp-map element.
    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
    });
    
    // Get the lat/lng from the inner map.
    center = innerMap.getCenter();
    
    // Add a marker, positioned at Uluru.
    const marker = new AdvancedMarkerElement({
        map: innerMap,
        position: center,
        title: 'Uluru',
    });
    
}
initMap();

