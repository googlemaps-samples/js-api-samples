/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_polyline_simple]
// This example creates a 2-pixel-wide red polyline showing the path of
// the first trans-Pacific flight between Oakland, CA, and Brisbane,
// Australia which was made by Charles Kingsford Smith.
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;
let innerMap;

async function initMap() {
    (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
    innerMap = mapElement.innerMap;

    const flightPlanCoordinates = [
        { lat: 37.772, lng: -122.214 },
        { lat: 21.291, lng: -157.821 },
        { lat: -18.142, lng: 178.431 },
        { lat: -27.467, lng: 153.027 },
    ];
    const flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });

    flightPath.setMap(innerMap);
}

initMap();
// [END maps_polyline_simple]
