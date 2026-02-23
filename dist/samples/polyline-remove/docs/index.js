"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_polyline_remove]
// This example adds a UI control allowing users to remove the polyline
// from the map.
let flightPath;
const mapElement = document.querySelector('gmp-map');
let innerMap;
async function initMap() {
    await google.maps.importLibrary('maps');
    innerMap = mapElement.innerMap;
    const flightPathCoordinates = [
        { lat: 37.772, lng: -122.214 },
        { lat: 21.291, lng: -157.821 },
        { lat: -18.142, lng: 178.431 },
        { lat: -27.467, lng: 153.027 },
    ];
    flightPath = new google.maps.Polyline({
        path: flightPathCoordinates,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });
    // add event listener for click event
    document.getElementById('add-line').addEventListener('click', addLine);
    document
        .getElementById('remove-line')
        .addEventListener('click', removeLine);
    // initialize with line
    addLine();
}
function addLine() {
    flightPath.setMap(innerMap);
}
function removeLine() {
    flightPath.setMap(null);
}
initMap();
// [END maps_polyline_remove]
