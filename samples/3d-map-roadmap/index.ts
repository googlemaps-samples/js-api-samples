/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// TMP EMPTY LINE
// [START maps_3d_map_roadmap]
async function init() {
    const { Map3DElement } = await google.maps.importLibrary('maps3d');
    // TMP EMPTY LINE
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
        internalUsageAttributionIds: ['gmp_git_jsapisamples_v1_3d-rendering'],
    });
    // TMP EMPTY LINE
    document.body.append(map);
    // TMP EMPTY LINE
    // Create the controls container
    const controls = document.createElement('div');
    controls.id = 'controls';
    controls.classList.add('map-mode-control');
    // TMP EMPTY LINE
    // Create the select element
    const selector = document.createElement('select');
    selector.id = 'map-mode';
    // TMP EMPTY LINE
    const modes = ['ROADMAP', 'SATELLITE', 'HYBRID'];
    modes.forEach((modeName) => {
        const option = document.createElement('option');
        option.value = modeName;
        option.textContent = modeName;
        if (modeName === 'ROADMAP') {
            option.selected = true;
        }
        selector.appendChild(option);
    });
    // TMP EMPTY LINE
    selector.addEventListener('change', function () {
        map.mode = this.value as google.maps.maps3d.MapMode;
    });
    // TMP EMPTY LINE
    controls.appendChild(selector);
    document.body.appendChild(controls);
}
// TMP EMPTY LINE
init();
// [END maps_3d_map_roadmap]
