"use strict";
/*
* @license
* Copyright 2025 Google LLC. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
// @ts-nocheck

let map;
async function init() {
    // Request needed libraries.
    const { Map3DElement, Marker3DElement } = await google.maps.importLibrary("maps3d");
    map = new Map3DElement({
        center: { lat: 47.6094, lng: -122.3390, altitude: 0 },
        range: 1000,
        mode: 'HYBRID'
    });
    map.mode = "SATELLITE";
    let zindex = 0;
    for (const [lng, lat] of positions) {
        const marker = new Marker3DElement({
            position: { lat, lng },
            // Try setting a different collision behavior here.
            collisionBehavior: google.maps.CollisionBehavior.REQUIRED,
            drawsWhenOccluded: true,
            zIndex: zindex++,
            label: zindex.toString(),
        });
        map.append(marker);
    }
    const collisionSelect = document.getElementById('collisionSelect');
    collisionSelect.addEventListener('change', handleCollisionSelection);
    document.body.append(map);
}
function handleCollisionSelection() {
    const selectedIndex = collisionSelect.selectedIndex;
    for (const marker of map.getElementsByTagName("gmp-marker-3d")) {
        marker.collisionBehavior = collisionSelect.value;
    }
}
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
init();

