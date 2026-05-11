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

// Declare the gmp-map element.
const mapElement = document.querySelector('gmp-map');
let innerMap;
let center;

async function init() {
    //  Request the needed libraries.
    const [{ AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('maps'),
    ]);

    // Get the inner map from the gmp-map element.
    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
    });

    // Get the lat/lng from the inner map.
    center = innerMap.getCenter();

    // Add a marker, positioned at Uluru.
    new AdvancedMarkerElement({
        map: innerMap,
        position: center,
        title: 'Uluru',
    });

    console.log('Hello! Having fun yet?');
}
void init();
