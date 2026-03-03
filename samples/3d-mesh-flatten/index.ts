/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_mesh_flatten]
async function initMap(): Promise<void> {
    await google.maps.importLibrary('maps3d');

    const map = document.querySelector('gmp-map-3d') as Element;
    const flattener = document.querySelector('gmp-flattener') as Element;
    map.append(flattener);

    const toggleButton = document.getElementById('toggleButton') as HTMLButtonElement;
    toggleButton.addEventListener('click', () => {
        if (flattener.isConnected) {
            flattener.remove();
            toggleButton.textContent = 'Enable Flattener';
        } else {
            map.append(flattener);
            toggleButton.textContent = 'Disable Flattener';
        }
    });

}

initMap();
// [END maps_3d_mesh_flatten]
