'use strict';
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_polygon_extruded_hole]
async function init() {
    const { Map3DElement, Polygon3DElement } =
        await google.maps.importLibrary('maps3d');

    const map3DElement = new Map3DElement({
        center: { lat: 40.6842, lng: -74.0019, altitude: 1000 },
        heading: 340,
        tilt: 70,
        mode: 'HYBRID',
        gestureHandling: 'COOPERATIVE',
    });

    const polygonOptions = {
        strokeColor: '#0000ff80',
        strokeWidth: 8,
        fillColor: '#ff000080',
        drawsOccludedSegments: false,
        extruded: true,
        altitudeMode: 'RELATIVE_TO_GROUND',
    };

    const examplePolygon = new Polygon3DElement(polygonOptions);

    examplePolygon.path = [
        { lat: 40.7144, lng: -74.0208, altitude: 200 },
        { lat: 40.6993, lng: -74.019, altitude: 200 },
        { lat: 40.7035, lng: -74.0004, altitude: 200 },
    ];

    examplePolygon.innerPaths = [
        [
            { lat: 40.71, lng: -74.0175, altitude: 200 },
            { lat: 40.703, lng: -74.0165, altitude: 200 },
            { lat: 40.7035, lng: -74.006, altitude: 200 },
        ],
    ];

    map3DElement.append(examplePolygon);

    document.body.append(map3DElement);
}

void init();
// [END maps_3d_polygon_extruded_hole]
