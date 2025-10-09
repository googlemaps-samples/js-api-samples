/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-nocheck
// [START maps_3d_marker_click_event]
async function initMap() {
    // Include the interactive marker class
    const { Map3DElement, Marker3DInteractiveElement } =
        await google.maps.importLibrary('maps3d')

    // We will use this to place the camrea for the intial view but also to fly around the starting point.
    const originalCamera = {
        center: { lat: 39.1178, lng: -106.4452, altitude: 4395.4952 },
        range: 1500,
        tilt: 74,
        heading: 0,
    }

    const map = new Map3DElement({
        ...originalCamera,
        mode: 'SATELLITE',
    })

    // Create the interactive marker and set the attributes.
    const interactiveMarker = new Marker3DInteractiveElement({
        position: { lat: 39.1178, lng: -106.4452, altitude: 100 },
        altitudeMode: 'RELATIVE_TO_MESH',
        extruded: true,
        label: 'Mount Elbert',
    })

    // Specify the action to take on click.
    interactiveMarker.addEventListener('gmp-click', (event) => {
        map.flyCameraAround({
            camera: originalCamera,
            durationMillis: 50000,
            repeatCount: 1,
        })
    })

    map.append(interactiveMarker)

    document.body.append(map)
}

initMap()
// [END maps_3d_marker_click_event]
