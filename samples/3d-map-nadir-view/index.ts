/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_map_nadir_view]
async function init() {
    const { Map3DElement } = await google.maps.importLibrary('maps3d');

    const map = new Map3DElement({
        center: {
            lat: 37.803,
            lng: -122.448,
            altitude: 0,
        },
        range: 2500,
        tilt: 0,
        heading: 0,
        mode: 'ROADMAP',
    });

    document.body.append(map);
}

void init();
// [END maps_3d_map_nadir_view]
