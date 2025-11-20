/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

//@ts-nocheck
// [START maps_3d_clamp_mode]
let polyline;

async function init() {
    const { Map3DElement, AltitudeMode, Polyline3DElement } =
        await google.maps.importLibrary('maps3d');

    const map = new Map3DElement({
        center: {
            lat: 47.660545553614604,
            lng: -122.4196302033452,
            altitude: 100,
        },
        tilt: 61,
        range: 4800,
        heading: 31,
        mode: 'SATELLITE',
        gestureHandling: 'COOPERATIVE',
    });

    polyline = new Polyline3DElement({
        path: [
            { lat: 47.6589, lng: -122.43012, altitude: 10 },
            { lat: 47.65598, lng: -122.425, altitude: 10 },
            { lat: 47.65515, lng: -122.42219, altitude: 10 },
            { lat: 47.65623, lng: -122.41895, altitude: 10 },
            { lat: 47.65775, lng: -122.41426, altitude: 10 },
            { lat: 47.6577, lng: -122.41089, altitude: 10 },
            { lat: 47.66206, lng: -122.40507, altitude: 10 },
            { lat: 47.6637, lng: -122.40547, altitude: 10 },
            { lat: 47.66488, lng: -122.41075, altitude: 10 },
            { lat: 47.6662, lng: -122.40877, altitude: 10 },
            { lat: 47.67166, lng: -122.40812, altitude: 10 },
        ],
        strokeColor: 'red',
        strokeWidth: 5,
        altitudeMode: AltitudeMode.CLAMP_TO_GROUND,
        drawsOccludedSegments: true,
    });

    map.append(polyline);
    document.body.append(map);
}

init();

// Dropdown event listener
const dropdown = document.getElementById('selectElementId');
dropdown.addEventListener('change', updateAltitudeMode);

function updateAltitudeMode(event) {
    if (polyline && dropdown.value) {
        polyline.altitudeMode = dropdown.value;
    }
}

// [END maps_3d_clamp_mode]
