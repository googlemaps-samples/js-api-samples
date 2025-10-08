"use strict";
/*
* @license
* Copyright 2025 Google LLC. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
// @ts-nocheck
// [START maps_3d_polyline_extruded]
let map;
async function init() {
    const { Map3DElement, MapMode, AltitudeMode, Polyline3DElement } = await google.maps.importLibrary("maps3d");
    map = new Map3DElement({
        center: { lat: 37.7927, lng: -122.4020, altitude: 65.93 }, range: 3362.87, tilt: 64.01, heading: 25.00,
        mode: MapMode.SATELLITE,
    });
    document.body.append(map);
    const polyline = new Polyline3DElement({
        path: [
            { lat: 37.80515638571346, lng: -122.4032569467164, altitude: 100 },
            { lat: 37.80337073509504, lng: -122.4012878349353, altitude: 100 },
            { lat: 37.79925208843463, lng: -122.3976697250461, altitude: 100 },
            { lat: 37.7989102378512, lng: -122.3983408725656, altitude: 100 },
            { lat: 37.79887832784348, lng: -122.3987094864192, altitude: 100 },
            { lat: 37.79786443410338, lng: -122.4066878788802, altitude: 100 },
            { lat: 37.79549248916587, lng: -122.4032992702785, altitude: 100 },
            { lat: 37.78861484290265, lng: -122.4019489189814, altitude: 100 },
            { lat: 37.78618687561075, lng: -122.398969592545, altitude: 100 },
            { lat: 37.7892310309145, lng: -122.3951458683092, altitude: 100 },
            { lat: 37.7916358762409, lng: -122.3981969390652, altitude: 100 }
        ],
        strokeColor: '#0000FF80',
        strokeWidth: 10,
        altitudeMode: AltitudeMode.RELATIVE_TO_GROUND, // Place it on the ground (as it has no altitude it will just be at ground height).
        extruded: true
    });
    map.append(polyline);
}
init();
// [END maps_3d_polyline_extruded]
