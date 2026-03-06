"use strict";
/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function initMap() {
    await google.maps.importLibrary('maps3d');
    const map = document.querySelector('gmp-map-3d');
    const flattener = document.querySelector('gmp-flattener');
    map.append(flattener);
    const toggleButton = document.getElementById('toggleButton');
    toggleButton.addEventListener('click', () => {
        if (flattener.isConnected) {
            flattener.remove();
            toggleButton.textContent = 'Enable Flattener';
        }
        else {
            map.append(flattener);
            toggleButton.textContent = 'Disable Flattener';
        }
    });
}
initMap();

