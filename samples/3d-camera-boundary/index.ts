/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_camera_boundary]
async function init(): Promise<void> {
    await google.maps.importLibrary('maps3d');

    const map3DElement = document.querySelector('gmp-map-3d')!;

    // Restrict the position of the camera to the specified bounds.
    map3DElement.bounds = {
        south: -48.3,
        west: 163.56,
        north: -32.86,
        east: -180,
    };
}

void init();
// [END maps_3d_camera_boundary]
