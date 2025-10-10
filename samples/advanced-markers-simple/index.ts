/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_advanced_markers_simple]
// [START maps_advanced_markers_simple_snippet]
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;
let innerMap;

async function initMap() {
    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
    });

    const marker = new AdvancedMarkerElement({
        map: innerMap,
        position: { lat: 37.4239163, lng: -122.0947209 },
    });
}
// [END maps_advanced_markers_simple_snippet]
initMap();
// [END maps_advanced_markers_simple]