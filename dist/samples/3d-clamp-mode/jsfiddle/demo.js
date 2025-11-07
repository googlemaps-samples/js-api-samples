"use strict";
/*
* @license
* Copyright 2025 Google LLC. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
//@ts-nocheck

let polyline;
async function init() {
    const { Map3DElement, AltitudeMode, Polyline3DElement } = await google.maps.importLibrary("maps3d");
    const map = new Map3DElement({
        center: { lat: 47.6205, lng: -122.3493, altitude: 300 },
        tilt: 67.5,
        range: 2000,
        heading: 0,
        mode: 'SATELLITE',
        gestureHandling: "COOPERATIVE"
    });
    // Create an east-west polyline through the Space Needle
    polyline = new Polyline3DElement({
        path: [
            { lat: 47.6205, lng: -122.3593, altitude: 100 }, // West point
            { lat: 47.6205, lng: -122.3393, altitude: 100 } // East point
        ],
        strokeColor: 'red',
        strokeWidth: 5,
        altitudeMode: AltitudeMode.CLAMP_TO_GROUND,
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

