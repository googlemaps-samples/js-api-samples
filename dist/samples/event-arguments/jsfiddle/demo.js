"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function initMap() {
    // Request needed libraries.
    await google.maps.importLibrary("maps");
    await google.maps.importLibrary("marker");
    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;
    innerMap.addListener("click", (e) => {
        placeMarkerAndPanTo(e.latLng, innerMap);
    });
}
function placeMarkerAndPanTo(latLng, map) {
    new google.maps.marker.AdvancedMarkerElement({
        position: latLng,
        map: map,
    });
    map.panTo(latLng);
}
initMap();

