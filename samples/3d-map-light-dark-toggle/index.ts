/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_map_light_dark_toggle]
async function init() {
    const { Map3DElement } = await google.maps.importLibrary('maps3d');

    // By default, the map follows the system's light or dark mode setting.
    const map = new Map3DElement({
        center: {
            lat: 40.758,
            lng: -73.9855,
            altitude: 0,
        },
        range: 2000,
        tilt: 60,
        heading: 30,
        mode: 'ROADMAP',
    });

    document.body.append(map);

    const toggleButton = document.getElementById(
        'toggle-button'
    ) as HTMLButtonElement;

    // Start from the system setting so that the button matches the map.
    let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    updateButtonText();

    toggleButton.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        // Override the system setting by switching to light or dark mode.
        map.setAttribute('color-scheme', isDarkMode ? 'DARK' : 'LIGHT');
        updateButtonText();
    });

    function updateButtonText() {
        toggleButton.textContent = isDarkMode
            ? 'Switch to light mode'
            : 'Switch to dark mode';
    }
}

void init();
// [END maps_3d_map_light_dark_toggle]
