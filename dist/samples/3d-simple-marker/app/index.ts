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
//@ts-nocheck
// [START maps_3d_simple_marker]
async function init() {
    // Make sure the Marker3DElement is included.
    const { Map3DElement, Marker3DElement } = await google.maps.importLibrary("maps3d");

    const map = new Map3DElement({
        center: { lat: 37.4239163, lng: -122.0947209, altitude: 0 },
        tilt: 67.5,
        range: 1000,
        mode: 'SATELLITE'
    });
    
    const marker = new Marker3DElement({
        position: { lat: 37.4239163, lng: -122.0947209, altitude: 50 }, // (Required) Marker must have a lat / lng, but do not need an altitude.
        altitudeMode : "ABSOLUTE", // (Optional) Treated as CLAMP_TO_GROUND if omitted.
        extruded : true, // (Optional) Draws line from ground to the bottom of the marker.
        label : "Basic Marker" // (Optional) Add a label to the marker.
    });

    map.append(marker); // The marker needs to be appended to the map.
    document.body.append(map);
}

init();
// [END maps_3d_simple_marker]
