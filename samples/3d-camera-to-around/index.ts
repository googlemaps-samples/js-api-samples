/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * * https://www.apache.org/licenses/LICENSE-2.0
 * * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// @ts-nocheck
// [START maps_3d_camera_to_around]
async function init() {
    const { Map3DElement } = await google.maps.importLibrary("maps3d");

    const map = new Map3DElement(
        { center: { lat: 37.79810773998413, lng : -122.41784275049939, altitude: 89.08476932205978 }, range: 6062.016931506805, tilt: 81.17100663963272, heading: -56.047035719765596, }
    );

    map.mode = "SATELLITE";

    document.body.append(map);

    // We will use this for foth the flying to function but also the location to fly around.
    const flyToCamera = { 
        center: { lat: 21.263523536467105, lng : -157.80663691939296, altitude: 80.28936069489404 }, 
        range: 1500.8202963253427, tilt: 76.9173260789542 ,heading: -44.59196007522445,
    }; 

    // Fly the camera from San Francisco to Hawaii, we could put this behind a button if we liked.
    map.flyCameraTo({
        // Where we are going to.
        endCamera: flyToCamera,
        // How long we want the flight to take.
        durationMillis: 30000,
    });

    // When the animation has completed fly around the location.
    map.addEventListener('gmp-animationend', () => {
        map.flyCameraAround({
            // What we are flying around.
            camera: flyToCamera,
            // How long we want it to take.
            durationMillis: 50000,
            // How many time it should fly around in the time we specified.
            rounds: 1
        });
    }, {once: true}); // Stop after the flying around.

    // At any time stop the animation.
    map.addEventListener('gmp-click', (event) => {
        map.stopCameraAnimation();
    });
}

init();
// [END maps_3d_camera_to_around]
