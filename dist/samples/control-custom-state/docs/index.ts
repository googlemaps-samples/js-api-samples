/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_control_custom_state]
let innerMap;
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;

let center: google.maps.LatLngLiteral = { lat: 41.85, lng: -87.65 };

async function initMap() {
    (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

    innerMap = mapElement.innerMap;

    // Get the button UI elements.
    const setCenterButton = document.getElementById('btnCenterMap') as HTMLInputElement;
    const resetCenterButton = document.getElementById('btnSetCenter') as HTMLInputElement;

    // [START maps_control_custom_state_event_listeners]
    // Set up the click event listener for the 'Center Map' button. Set the map
    // to the currently stored center.
    setCenterButton.addEventListener('click', () => {
        const currentCenter = center;
        innerMap.setCenter(currentCenter);
    });

    // Set up the click event listener for 'Set Center': Set the center of
    // the control to the current center of the map.
    resetCenterButton.addEventListener('click', () => {
        const newCenter = innerMap.getCenter();

        if (newCenter) {
            center = newCenter;
        }
    });
    // [END maps_control_custom_state_event_listeners]
}

initMap();
// [END maps_control_custom_state]
