/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_map_roadmap]
async function init() {
    const { Map3DElement } = await google.maps.importLibrary('maps3d');

    const map = new Map3DElement({
        center: {
            lat: 37.79334535092104,
            lng: -122.400742086205,
            altitude: 0,
        },
        range: 2400,
        tilt: 65,
        heading: 0,
        mode: 'ROADMAP',
        // Hide the default UI controls, since this sample has its own mode selector.
        defaultUIHidden: true,
    });

    document.body.append(map);

    // Change the map mode when a new option is selected.
    const selector = document.getElementById('map-mode') as HTMLSelectElement;
    selector.addEventListener('change', () => {
        map.mode = selector.value as google.maps.maps3d.MapModeString;
    });
}

void init();
// [END maps_3d_map_roadmap]
