"use strict";
/*
* @license
* Copyright 2025 Google LLC. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
// @ts-nocheck
// [START maps_3d_camera_to_around]
async function init() {
    const { Map3DElement } = await google.maps.importLibrary("maps3d");
    const map = new Map3DElement({ center: { lat: 37.79810773998413, lng: -122.41784275049939, altitude: 89.08476932205978 }, range: 6062.016931506805, tilt: 81.17100663963272, heading: -56.047035719765596, });
    map.mode = "SATELLITE";
    document.body.append(map);
    // Used for both the fly to function and the location to fly around.
    const flyToCamera = {
        center: { lat: 21.263523536467105, lng: -157.80663691939296, altitude: 80.28936069489404 },
        range: 1500.8202963253427, tilt: 76.9173260789542, heading: -44.59196007522445,
    };
    // Fly the camera from San Francisco to Hawaii, can be controlled by a button alternatively.
    map.flyCameraTo({
        // Where we are going to.
        endCamera: flyToCamera,
        // How long we want the flight to take.
        durationMillis: 30000,
    });
    // When the animation has completed, fly around the location.
    map.addEventListener('gmp-animationend', () => {
        map.flyCameraAround({
            // Location to fly around.
            camera: flyToCamera,
            // Length of time to fly to the location.
            durationMillis: 50000,
            // Number of rotations to make in the specified time.
            rounds: 1
        });
    }, { once: true }); // Stop animation after flying around.
    // At any time stop the animation.
    map.addEventListener('gmp-click', (event) => {
        map.stopCameraAnimation();
    });
}
init();
// [END maps_3d_camera_to_around]
