"use strict";
/*
* @license
* Copyright 2025 Google LLC. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
//@ts-nocheck
// [START maps_3d_simple_map]
async function initMap() {
    const { Map3DElement } = await google.maps.importLibrary("maps3d");
    const map = new Map3DElement({
        center: { lat: 37.7704, lng: -122.3985, altitude: 500 },
        tilt: 67.5,
        mode: 'HYBRID'
    });
    document.body.append(map);
}
initMap();
// [END maps_3d_simple_map]
