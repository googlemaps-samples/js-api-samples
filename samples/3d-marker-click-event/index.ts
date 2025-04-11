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
// [START maps_3d_marker_click_event]
async function initMap() {
    // Include the interactive marker class
    const { Map3DElement, Marker3DInteractiveElement } = await google.maps.importLibrary("maps3d");

    // We will use this to place the camrea for the intial view but also to fly around the starting point.
    const originalCamera = {
        center: { lat: 39.1178, lng: -106.4452, altitude: 4395.4952 }, range: 1500, tilt: 74, heading: 0
    };

    const map = new Map3DElement({
        ...originalCamera,
        mode: "SATELLITE",
    });

    // Create the interactive marker and set the attributes.
    const interactiveMarker = new Marker3DInteractiveElement({
        position: { lat: 39.1178, lng: -106.4452, altitude: 100 },
        altitudeMode: "RELATIVE_TO_MESH",
        extruded: true,
        label: "Mount Elbert"
    });

    // Specify the action to take on click.
    interactiveMarker.addEventListener('gmp-click', (event) => {
        map.flyCameraAround({
            camera: originalCamera,
            durationMillis: 50000,
            rounds: 1
        });
    });

    map.append(interactiveMarker);

    document.body.append(map);
}

initMap();
// [END maps_3d_marker_click_event]
