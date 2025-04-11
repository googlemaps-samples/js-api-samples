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
// [START maps_3d_label_toggle]
let map;
async function init() {
    const { Map3DElement, MapMode } = await google.maps.importLibrary("maps3d");

    map = new Map3DElement(
        { center: { lat: 37.79810773998413, lng: -122.41784275049939, altitude: 89.08476932205978 }, range: 6062.016931506805, tilt: 81.17100663963272, heading: -56.047035719765596, }
    );

    map.mode = MapMode.SATELLITE;

    document.body.append(map);

    const locationCamera = {
        center: { lat: 21.263523536467105, lng: -157.80663691939296, altitude: 80.28936069489404 },
        range: 1500.8202963253427, tilt: 76.9173260789542, heading: -44.59196007522445,
    };

    // Get the button element by its ID
    const toggleButton = document.getElementById('toggleButton');
    toggleButton.addEventListener('click', function () {
        // Toggle the labels.
        if (map.mode == MapMode.SATELLITE) {
            // Setting the map mode to HYBRID turns the labels on.
            map.mode = MapMode.HYBRID;
            document.getElementById('toggleButton').innerText = "Labels are on. (HYBRID)";
        } else {
            // Setting the map mode to SATELLITE turns the labels on.
            map.mode = MapMode.SATELLITE;
            document.getElementById('toggleButton').innerText = "Labels are off. (SATELLITE)";
        }
    });
}

init();
// [END maps_3d_label_toggle]
