'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_control_positioning]
const mapElement = document.querySelector('gmp-map');
let innerMap;

async function init() {
    // Request needed libraries.
    const [{ MapTypeControlStyle }, { ControlPosition }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('core'),
    ]);

    // Get the inner map.
    innerMap = mapElement.innerMap;

    // Set the map's controls options.
    innerMap.setOptions({
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: MapTypeControlStyle.HORIZONTAL_BAR,
            position: ControlPosition.BLOCK_START_INLINE_CENTER,
        },
        zoomControl: true,
        zoomControlOptions: {
            position: ControlPosition.INLINE_START_BLOCK_CENTER,
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: ControlPosition.INLINE_START_BLOCK_START,
        },
        fullscreenControl: true,
    });
}

void init();
// [END maps_control_positioning]
