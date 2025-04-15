"use strict";
/*
* @license
* Copyright 2025 Google LLC. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
// @ts-nocheck

async function init() {
    const { Map3DElement, MapMode, Polygon3DElement } = await google.maps.importLibrary("maps3d");
    const map3DElement = new Map3DElement({
        center: { lat: 40.6842, lng: -74.0019, altitude: 1000 },
        heading: 340,
        tilt: 70,
        mode: MapMode.HYBRID,
    });
    const polygonOptions = {
        strokeColor: "#0000ff80",
        strokeWidth: 8,
        fillColor: "#ff000080",
        drawsOccludedSegments: false,
    };
    const examplePolygon = new google.maps.maps3d.Polygon3DElement(polygonOptions);
    examplePolygon.outerCoordinates = [
        { lat: 40.7144, lng: -74.0208 },
        { lat: 40.6993, lng: -74.019 },
        { lat: 40.7035, lng: -74.0004 },
        { lat: 40.7144, lng: -74.0208 }
    ];
    map3DElement.append(examplePolygon);
    document.body.append(map3DElement);
}
init();

