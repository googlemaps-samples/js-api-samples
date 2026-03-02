/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_mesh_flatten]
async function initMap(): Promise<void> {
    await google.maps.importLibrary('maps3d');

    const path = [
        { lat: 40.707680607935245, lng: -74.00310353377735, altitude: 500 },
        { lat: 40.70829665151717, lng: -74.00193595590612, altitude: 500 },
        { lat: 40.7073748659931, lng: -74.00122787224885, altitude: 500 },
        { lat: 40.706738652153156, lng: -74.00232125268805, altitude: 500 },
        { lat: 40.70738164589913, lng: -74.0028721484274, altitude: 500 },
    ];

    const map = document.querySelector('gmp-map-3d') as Element;
    const flattener = document.createElement('gmp-flattener') as any;
    flattener.path = path;
    map.append(flattener);
// [START_EXCLUDE]
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
// [END_EXCLUDE]
}

initMap();
// [END maps_3d_mesh_flatten]
