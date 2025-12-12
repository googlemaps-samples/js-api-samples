/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

//@ts-nocheck
// [START maps_3d_45_degree]
async function init() {
    const { Map3DElement } = await google.maps.importLibrary('maps3d');
    const map = new Map3DElement({
        center: {
            lat: 37.789,
            lng: -122.401,
            altitude: 0,
        },
        range: 2200,
        tilt: 45,
        heading: 188,
    });
    map.mode = 'SATELLITE';
    document.body.append(map);
}

init();
// [END maps_3d_45_degree]
