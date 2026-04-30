/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_camera_center]
async function initMap(): Promise<void> {
    // Import the needed libraries.
    await google.maps.importLibrary('maps3d');

    // @ts-ignore
    const map3DElement = document.querySelector('gmp-map-3d') as google.maps.Map3DElement;
    const btn = document.getElementById('switch-mode-btn') as HTMLButtonElement;

    const initialCenter = { lat: 40.7860524, lng: -73.9634983, altitude: 0 };
    let isCenterMode = true;

    btn.addEventListener('click', () => {
        if (isCenterMode) {
            // Switch to Camera Position Mode.
            // Place the camera at the marker's location, but 50m up in the air
            map3DElement.cameraPosition = { ...initialCenter, altitude: 50 };
            map3DElement.tilt = 80;
            
            btn.textContent = 'Switch to Center Mode';
            isCenterMode = false;
        } else {
            // Revert back to Center Mode (looking AT the marker)
            map3DElement.center = initialCenter;
            map3DElement.tilt = 70;
            map3DElement.range = 1500; // Restore the original range value.

            btn.textContent = 'Switch to Camera Position';
            isCenterMode = true;
        }
    });
}

initMap();
// [END maps_3d_camera_center]
