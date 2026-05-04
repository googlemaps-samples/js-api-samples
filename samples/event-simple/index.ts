/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_event_simple]
async function initMap() {
    // Request needed libraries.
    await google.maps.importLibrary('maps');
    await google.maps.importLibrary('marker');

    // Retrieve the map element.
    const mapElement = document.querySelector('gmp-map')!;

    // Get the inner map from the map element.
    const innerMap = mapElement.innerMap;

    const center = mapElement.center;

    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: center,
        map: innerMap,
        title: 'Click to zoom',
        gmpClickable: true,
    });

    innerMap.addListener('center_changed', () => {
        // 3 seconds after the center of the map has changed,
        // pan back to the marker.
        window.setTimeout(() => {
            innerMap.panTo(marker.position);
        }, 3000);
    });

    // Zoom in when the marker is clicked.
    marker.addEventListener('gmp-click', () => {
        innerMap.setZoom(8);
        innerMap.setCenter(marker.position);
    });
}

initMap();
// [END maps_event_simple]
