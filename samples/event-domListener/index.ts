/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_event_domListener]
async function initMap() {
    // Request needed libraries.
    (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

    const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;

    // Add a listener for the click event and display an alert when the map is clicked.
    mapElement.addEventListener('click', () => {
        window.alert('Map was clicked!');
    });
}
initMap();
// [END maps_event_domListener]