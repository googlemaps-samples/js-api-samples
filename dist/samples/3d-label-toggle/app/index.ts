/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_label_toggle]
let map: google.maps.maps3d.Map3DElement;
async function init() {
    const { Map3DElement } = await google.maps.importLibrary('maps3d');

    map = new Map3DElement({
        center: {
            lat: 37.79810773998413,
            lng: -122.41784275049939,
            altitude: 89.08476932205978,
        },
        range: 6062.016931506805,
        tilt: 81.17100663963272,
        heading: -56.047035719765596,
        gestureHandling: 'COOPERATIVE',
    });

    map.mode = 'SATELLITE';

    document.body.append(map);

    // Get the button element by its ID
    const toggleButton = document.getElementById('toggleButton')!;
    toggleButton.addEventListener('click', function () {
        // Toggle the labels.
        if (map.mode == 'SATELLITE') {
            // Setting the map mode to HYBRID turns the labels on.
            map.mode = 'HYBRID';
            toggleButton.innerText = 'Labels are on. (HYBRID)';
        } else {
            // Setting the map mode to SATELLITE turns the labels on.
            map.mode = 'SATELLITE';
            toggleButton.innerText = 'Labels are off. (SATELLITE)';
        }
    });
}

void init();
// [END maps_3d_label_toggle]
