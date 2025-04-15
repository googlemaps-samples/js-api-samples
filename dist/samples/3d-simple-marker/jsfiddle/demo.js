"use strict";
/*
* @license
* Copyright 2025 Google LLC. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
//@ts-nocheck

async function init() {
    // Make sure the Marker3DElement is included.
    const { Map3DElement, Marker3DElement } = await google.maps.importLibrary("maps3d");
    const map = new Map3DElement({
        center: { lat: 37.4239163, lng: -122.0947209, altitude: 0 },
        tilt: 67.5,
        range: 1000,
        mode: 'SATELLITE'
    });
    const marker = new Marker3DElement({
        position: { lat: 37.4239163, lng: -122.0947209, altitude: 50 }, // (Required) Marker must have a lat / lng, but do not need an altitude.
        altitudeMode: "ABSOLUTE", // (Optional) Treated as CLAMP_TO_GROUND if omitted.
        extruded: true, // (Optional) Draws line from ground to the bottom of the marker.
        label: "Basic Marker" // (Optional) Add a label to the marker.
    });
    map.append(marker); // The marker needs to be appended to the map.
    document.body.append(map);
}
init();

