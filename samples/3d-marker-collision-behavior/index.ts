/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-nocheck
// [START maps_3d_marker_collision_behavior]
const markers = []

async function init() {
    // Request needed libraries.
    const { Map3DElement, MapMode, Marker3DElement } =
        await google.maps.importLibrary('maps3d')

    const map = new Map3DElement({
        center: { lat: 47.6094, lng: -122.339, altitude: 0 },
        range: 1000,
        mode: MapMode.HYBRID,
        gestureHandling: 'COOPERATIVE',
    })

    for (const [lng, lat] of positions) {
        const marker = new Marker3DElement({
            position: { lat, lng },
            // Try setting a different collision behavior here.
            collisionBehavior: google.maps.CollisionBehavior.REQUIRED,
        })

        markers.push(marker)
        map.append(marker)
    }

    document.body.append(map)
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
]

init()

const dropdown = document.getElementById('selectElementId')
dropdown.addEventListener('change', drawMap)

function drawMap(event) {
    for (const marker of markers) {
        marker.collisionBehavior =
            dropdown.value || google.maps.CollisionBehavior.REQUIRED
    }
}

// [END maps_3d_marker_collision_behavior]
