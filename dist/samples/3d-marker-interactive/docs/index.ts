/*
* @license
* Copyright 2025 Google LLC. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/

// @ts-nocheck
// [START maps_3d_marker_interactive]
async function init() {
    // Request needed libraries.
    const { Map3DElement, Marker3DInteractiveElement, PopoverElement } = await google.maps.importLibrary("maps3d");

    const map = new Map3DElement({
        center: { lat: 37.4690, lng: -122.1074, altitude: 0 },
        tilt: 67.5,
        range: 45000,
        mode: 'HYBRID'
    });

    map.mode = "SATELLITE";

    for (const position of positions) {
        const popover = new PopoverElement({
            open: true,
        });

        popover.append(position.name);

        const interactiveMarker = new Marker3DInteractiveElement({
            position,
            gmpPopoverTargetElement: popover
        });

        map.append(interactiveMarker);
        map.append(popover);
    }

    document.body.append(map);
}

const positions = [{
    lat: 37.50981071450543,
    lng:  -122.20280629839084,
    name: "Google Redwood City",
}, {
    lat: 37.423897572754754, 
    lng: -122.09167346506989,
    name: "Google West Campus",
}, {
    lat: 37.42333982824077, 
    lng: -122.06647571637265,
    name: "Google Bay View",
}, {
    lat: 37.42193728115661, 
    lng: -122.08531908774293,
    name: "Googleplex",
}, {
    lat: 37.39982552146971,
    lng:  -122.057934225745,
    name: "Google Quad Campus",
}, {
    lat: 37.40317922575345, 
    lng: -122.03276863941647,
    name: "Google Tech Corners",
}, {
    lat: 37.41181058680138, 
    lng: -121.9538960231151,
    name: "Google San Jose",
}, {
    lat: 37.62759428242346, 
    lng: -122.42615377188994,
    name: "Google San Bruno",
}, {
    lat: 37.40369749797231, 
    lng: -122.14812537955007,
    name: "Google Palo Alto",
}, {
    lat: 37.793664664297964,
    lng: -122.39504580413139,
    name: "Google San Francisco",
}];

init();
// [END maps_3d_marker_interactive]
