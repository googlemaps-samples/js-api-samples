'use strict';
/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_map_styling]
async function init() {
    const { Map3DElement } = await google.maps.importLibrary('maps3d');

    const map = new Map3DElement({
        center: {
            lat: 37.75183154601466,
            lng: -119.52369070507672,
            altitude: 2200,
        },
        tilt: 67.5,
        heading: 108.94057782079429,
        range: 6605.57279990986,
        mapId: 'bcce776b92de1336e22c569f', // Styles are associated with map IDs.
        mode: 'HYBRID',
    });

    document.body.append(map);
}

void init();
// [END maps_3d_map_styling]
