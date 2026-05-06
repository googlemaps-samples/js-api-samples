'use strict';
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

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
    };

    const examplePolygon = new Polygon3DElement(polygonOptions);

    examplePolygon.path = [
        { lat: 40.7144, lng: -74.0208 },
        { lat: 40.6993, lng: -74.019 },
        { lat: 40.7035, lng: -74.0004 },
    ];

    map3DElement.append(examplePolygon);

    document.body.append(map3DElement);
}

void init();
