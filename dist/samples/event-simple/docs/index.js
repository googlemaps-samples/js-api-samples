'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_event_simple]
async function initMap() {
    // Request needed libraries.
    const [, { AdvancedMarkerElement }, { LatLng }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('core'),
    ]);

    // Retrieve the map element.
    const mapElement = document.querySelector('gmp-map');

    // Get the inner map from the map element.
    const innerMap = mapElement.innerMap;

    const originalPosition = new LatLng(mapElement.center);

    const marker = new AdvancedMarkerElement({
        position: originalPosition,
        map: innerMap,
        title: 'Click to zoom',
        gmpClickable: true,
    });

    innerMap.addListener('center_changed', () => {
        // 3 seconds after the center of the map has changed,
        // pan back to the marker.
        window.setTimeout(() => {
            innerMap.panTo(originalPosition);
        }, 3000);
    });

    // Zoom in when the marker is clicked.
    marker.addEventListener('gmp-click', () => {
        innerMap.setZoom(8);
        innerMap.setCenter(originalPosition);
    });
}

void initMap();
// [END maps_event_simple]
