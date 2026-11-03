/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_map_ui_controls]
async function init() {
    const { Map3DElement } = await google.maps.importLibrary('maps3d');

    const map = new Map3DElement({
        center: {
            lat: 51.5007,
            lng: -0.1246,
            altitude: 0,
        },
        range: 2000,
        tilt: 60,
        heading: 0,
        mode: 'ROADMAP',
        // Hide the default UI controls.
        defaultUIHidden: true,
    });

    document.body.append(map);

    const toggleButton = document.getElementById(
        'toggle-button'
    ) as HTMLButtonElement;

    toggleButton.addEventListener('click', () => {
        // Toggle the visibility of the default UI controls.
        map.defaultUIHidden = !map.defaultUIHidden;
        toggleButton.textContent = map.defaultUIHidden
            ? 'Show UI controls'
            : 'Hide UI controls';
    });
}

void init();
// [END maps_3d_map_ui_controls]
