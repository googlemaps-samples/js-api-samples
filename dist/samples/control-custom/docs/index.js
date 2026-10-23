"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_control_custom]
const chicago = { lat: 41.85, lng: -87.65 };
// Get the gmp-map element
const mapElement = document.querySelector('gmp-map');
async function init() {
    (await google.maps.importLibrary('maps'));
    // Get the inner map.
    const innerMap = mapElement.innerMap;
    // Get the button element from the HTML
    const centerButton = document.getElementById('btnCenterMap');
    // Move the event listener here
    centerButton.addEventListener('click', () => {
        innerMap.setCenter(chicago);
    });
}
void init();
// [END maps_control_custom]
