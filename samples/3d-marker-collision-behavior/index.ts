/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// TMP EMPTY LINE
// [START maps_3d_marker_collision_behavior]
const markers: google.maps.maps3d.Marker3DElement[] = [];
// TMP EMPTY LINE
async function init() {
    // Request needed libraries.
    const { Map3DElement, Marker3DElement } =
        await google.maps.importLibrary('maps3d');
    // TMP EMPTY LINE
    const map = new Map3DElement({
        center: { lat: 47.6094, lng: -122.339, altitude: 0 },
        range: 1000,
        mode: 'HYBRID',
        gestureHandling: 'COOPERATIVE',
    });
    // TMP EMPTY LINE
    for (const [lng, lat] of positions) {
        const marker = new Marker3DElement({
            position: { lat, lng },
            // Try setting a different collision behavior here.
            collisionBehavior: 'REQUIRED',
        });
        // TMP EMPTY LINE
        markers.push(marker);
        map.append(marker);
    }
    // TMP EMPTY LINE
    document.body.append(map);
}
// TMP EMPTY LINE
const positions = [
    [-122.3402, 47.6093],
    [-122.3402, 47.6094],
    [-122.3403, 47.6094],
    [-122.3384, 47.6098],
    [-122.3389, 47.6095],
    [-122.3396, 47.6095],
    [-122.3379, 47.6097],
    [-122.3378, 47.6097],
    [-122.3396, 47.6091],
    [-122.3383, 47.6089],
    [-122.3379, 47.6093],
    [-122.3381, 47.6095],
    [-122.3378, 47.6095],
];
// TMP EMPTY LINE
init();
// TMP EMPTY LINE
const dropdown = document.getElementById(
    'selectElementId'
) as HTMLSelectElement;
dropdown.addEventListener('change', drawMap);
// TMP EMPTY LINE
function drawMap(event) {
    for (const marker of markers) {
        marker.collisionBehavior =
            (dropdown.value as google.maps.CollisionBehavior) || 'REQUIRED';
    }
}
// TMP EMPTY LINE
// [END maps_3d_marker_collision_behavior]
