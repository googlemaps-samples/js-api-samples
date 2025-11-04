"use strict";
/*
* @license
* Copyright 2025 Google LLC. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
//@ts-nocheck
// [START maps_3d_map_styling]
async function initMap() {
    const { Map3DElement } = await google.maps.importLibrary("maps3d");
    const map = new Map3DElement({
        center: { lat: 37.75183154601466, lng: -119.52369070507672, altitude: 2200 },
        tilt: 67.5,
        heading: 108.94057782079429,
        range: 6605.57279990986,
        mapId: 'bcce776b92de1336e22c569f',
        mode: 'HYBRID',
        gestureHandling: "COOPERATIVE"
    });
    document.body.append(map);
}
initMap();
// [END maps_3d_map_styling]
