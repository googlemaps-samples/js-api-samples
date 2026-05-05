/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// TMP EMPTY LINE
// [START maps_3d_mesh_flatten]
async function initMap(): Promise<void> {
    await google.maps.importLibrary('maps3d');
    // TMP EMPTY LINE
    const map = document.querySelector('gmp-map-3d')!;
    const flattener = document.querySelector('gmp-flattener')!;
    map.append(flattener);
    // TMP EMPTY LINE
    const toggleButton = document.getElementById(
        'toggleButton'
    ) as HTMLButtonElement;
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
// TMP EMPTY LINE
initMap();
// [END maps_3d_mesh_flatten]
