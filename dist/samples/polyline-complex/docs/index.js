"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_polyline_complex]
/**
 * This example creates an interactive map which constructs a polyline based on
 * user clicks. Note that the polyline only appears once its path property
 * contains two LatLng coordinates.
 */
let poly;
const mapElement = document.querySelector('gmp-map');
let innerMap;
async function initMap() {
    // Import the needed libraries.
    (await google.maps.importLibrary('maps'));
    (await google.maps.importLibrary('marker'));
    innerMap = mapElement.innerMap;
    poly = new google.maps.Polyline({
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 3,
    });
    poly.setMap(innerMap);
    // Add a listener for the click event
    innerMap.addListener("click", addLatLng);
}
// Handles click events on a map, and adds a new point to the Polyline.
function addLatLng(event) {
    const path = poly.getPath();
    // Because path is an MVCArray, we can simply append a new coordinate
    // and it will automatically appear.
    path.push(event.latLng);
    // Add a new marker at the new plotted point on the polyline.
    new google.maps.marker.AdvancedMarkerElement({
        position: event.latLng,
        title: "#" + path.getLength(),
        map: innerMap,
    });
}
initMap();
// [END maps_polyline_complex]
