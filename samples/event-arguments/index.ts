/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_event_arguments]
async function initMap() {
    // Request needed libraries.
    await google.maps.importLibrary('maps');
    await google.maps.importLibrary('marker');

    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;
    const innerMap = mapElement.innerMap;

    innerMap.addListener('click', (e) => {
        placeMarkerAndPanTo(e.latLng, innerMap);
    });
}

function placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map) {
    new google.maps.marker.AdvancedMarkerElement({
        position: latLng,
        map: map,
    });
    map.panTo(latLng);
}

initMap();
// [END maps_event_arguments]
