/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_advanced_markers_altitude]
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;
let innerMap;

async function initMap() {
    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    mapElement.innerMap.setOptions ({
        tilt: 67.5,
        heading: 45,
    });

    // [START maps_advanced_markers_altitude_marker]
    const pin = new PinElement({
        background: '#4b2e83',
        borderColor: '#b7a57a',
        glyphColor: '#b7a57a',
        scale: 2.0,
    });

    const markerView = new AdvancedMarkerElement({
        content: pin.element,
        // Set altitude to 20 meters above the ground.
        position: { lat: 47.65170843460547, lng: -122.30754, altitude: 20 } as google.maps.LatLngAltitudeLiteral,
    });

    mapElement.append(markerView);
    // [END maps_advanced_markers_altitude_marker]
}

initMap();
// [END maps_advanced_markers_altitude]
