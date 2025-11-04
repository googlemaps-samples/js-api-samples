/*
* @license
* Copyright 2025 Google LLC. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/

// @ts-nocheck
// [START maps_3d_popover_location]
async function init() {
const { AltitudeMode, Map3DElement, MapMode, PopoverElement } = await google.maps.importLibrary("maps3d");

const map = new Map3DElement({
    center: { lat: 37.8204, lng : -122.4783, altitude: 0.407 }, range: 4000, tilt: 74 ,heading: 38,
    mode: MapMode.HYBRID,
    gestureHandling: "COOPERATIVE"
});

const popover = new PopoverElement({
    altitudeMode: AltitudeMode.ABSOLUTE,
    open: true,
    positionAnchor: { lat: 37.819852, lng: -122.478549, altitude: 150 },
});

popover.append('Golden Gate Bridge');

map.append(popover);

document.body.append(map);

}

init();
// [END maps_3d_popover_location]
