/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-nocheck
// [START maps_3d_popover_marker]
async function init() {
    const {
        AltitudeMode,
        Map3DElement,
        Marker3DInteractiveElement,
        MapMode,
        PopoverElement,
    } = await google.maps.importLibrary('maps3d')

    const map = new Map3DElement({
        center: { lat: 37.8204, lng: -122.4783, altitude: 0.407 },
        range: 4000,
        tilt: 74,
        heading: 38,
        mode: MapMode.HYBRID,
    })

    // Popovers can only be added to interactive Markers
    const interactiveMarker = new Marker3DInteractiveElement({
        altitudeMode: AltitudeMode.ABSOLUTE,
        position: { lat: 37.819852, lng: -122.478549, altitude: 100 },
    })

    const popover = new PopoverElement({
        open: false,
        positionAnchor: interactiveMarker,
    })

    popover.append('Golden Gate Bridge')

    interactiveMarker.addEventListener('gmp-click', (event) => {
        // toggle the marker to the other state (unlee you are clicking on the marker itself when it reopens it)
        popover.open = !popover.open
    })

    map.append(interactiveMarker)
    map.append(popover)

    document.body.append(map)
}

init()
// [END maps_3d_popover_marker]
