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
// [START maps_3d_simple_map]
async function initMap() {
    const { Map3DElement } = await google.maps.importLibrary("maps3d");

    const map = new Map3DElement({
        center: { lat: 37.7704, lng: -122.3985, altitude: 500 },
        tilt: 67.5,
        mode: 'HYBRID'
    });

    document.body.append(map);
}

initMap();
// [END maps_3d_simple_map]
