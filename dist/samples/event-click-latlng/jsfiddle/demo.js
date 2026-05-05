'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function initMap() {
    // Request needed libraries.
    await google.maps.importLibrary('maps');
    const { InfoWindow } = await google.maps.importLibrary('maps');

    // Set up the map.
    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;

    // Get the initial center of the map.
    const position = innerMap.getCenter();

    // Create the initial InfoWindow.
    let infoWindow = new InfoWindow({
        content: 'Click the map to get Lat/Lng!',
        position,
    });

    infoWindow.open(innerMap);

    // Configure the click listener.
    innerMap.addListener('click', (mapsMouseEvent) => {
        // Close the current InfoWindow.
        infoWindow.close();

        // Create a new InfoWindow.
        infoWindow = new InfoWindow({
            position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
            JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        );
        infoWindow.open(innerMap);
    });
}

initMap();
