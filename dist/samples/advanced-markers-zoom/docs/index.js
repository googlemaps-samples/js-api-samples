"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_advanced_markers_zoom]
const mapElement = document.querySelector('gmp-map');
async function initMap() {
    // Request needed libraries.
    const { Map } = (await google.maps.importLibrary('maps'));
    const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker'));
    const markerOptions = [
        {
            position: { lat: 37.4239163, lng: -122.094 },
            title: 'This marker is visible at zoom level 15 and higher.',
            minZoom: 14,
        },
        {
            position: { lat: 37.4245, lng: -122.096 },
            title: 'This marker is visible at zoom level 16 and higher.',
            minZoom: 15,
        },
        {
            position: { lat: 37.4249, lng: -122.095 },
            title: 'This marker is visible at zoom level 17 and higher.',
            minZoom: 16,
        },
        {
            position: { lat: 37.425, lng: -122.0955 },
            title: 'This marker is visible at zoom level 18 and higher.',
            minZoom: 17,
        },
    ];
    const markers = [];
    for (const { position, title } of markerOptions) {
        const marker = new AdvancedMarkerElement({ position, title });
        mapElement.append(marker);
        markers.push(marker);
    }
    // [START maps_advanced_markers_zoom_listener]
    mapElement.innerMap.addListener('zoom_changed', () => {
        let zoom = mapElement.innerMap.getZoom();
        for (let i = 0; i < markers.length; i++) {
            const { position, minZoom } = markerOptions[i];
            markers[i].position = zoom > minZoom ? position : null;
        }
    });
    // [END maps_advanced_markers_zoom_listener]
}
initMap();
// [END maps_advanced_markers_zoom]
