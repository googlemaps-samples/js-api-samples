/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-nocheck
// [START maps_3d_camera_boundary]
async function initMap() {
    const { Map3DElement } = await google.maps.importLibrary('maps3d')

    const map = new Map3DElement({
        center: { lat: -36.86, lng: 174.76, altitude: 10000 },
        tilt: 67.5,
        mode: 'HYBRID',
        bounds: { south: -48.3, west: 163.56, north: -32.86, east: -180 },
        gestureHandling: 'COOPERATIVE',
    })

    document.body.append(map)
}

initMap()
// [END maps_3d_camera_boundary]
