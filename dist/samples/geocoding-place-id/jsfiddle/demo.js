'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// Initialize the map.
async function initMap() {
    const [{ Geocoder }, { InfoWindow }] = await Promise.all([
        google.maps.importLibrary('geocoding'),
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
    ]);

    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;
    const geocoder = new Geocoder();
    const infoWindow = new InfoWindow();

    document.getElementById('submit').addEventListener('click', () => {
        geocodePlaceId(geocoder, innerMap, infoWindow);
    });
}

// This function is called when the user clicks the UI button.
async function geocodePlaceId(geocoder, map, infoWindow) {
    const placeId = document.getElementById('place-id').value;

    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

    const { results } = await geocoder.geocode({ placeId: placeId });
    if (results[0]) {
        map.setZoom(11);
        map.setCenter(results[0].geometry.location);

        const marker = new AdvancedMarkerElement({
            map,
            position: results[0].geometry.location,
        });

        infoWindow.setContent(results[0].formatted_address);
        infoWindow.open(map, marker);
    } else {
        window.alert('No results found');
    }
}

initMap();
