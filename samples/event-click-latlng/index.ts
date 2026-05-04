/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_event_click_latlng]
async function initMap() {
    // Request needed libraries.
    (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

    // Set up the map.
    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;
    const innerMap = mapElement.innerMap;

    // Get the initial center of the map.
    const position = innerMap.getCenter() as google.maps.LatLng;

    // Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
        content: 'Click the map to get Lat/Lng!',
        position,
    });

    infoWindow.open(innerMap);

    // [START maps_event_click_latlng_listener]
    // Configure the click listener.
    innerMap.addListener('click', (mapsMouseEvent) => {
        // Close the current InfoWindow.
        infoWindow.close();

        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
            JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        );
        infoWindow.open(innerMap);
    });
    // [END maps_event_click_latlng_listener]
}

initMap();
// [END maps_event_click_latlng]
