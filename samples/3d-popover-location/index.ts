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
// [START 3d-popover-location]
async function init() {
const { AltitudeMode, Map3DElement, MapMode, PopoverElement } = await google.maps.importLibrary("maps3d");

const map = new Map3DElement({
    center: { lat: 37.8204, lng : -122.4783, altitude: 0.407 }, range: 4000, tilt: 74 ,heading: 38,
    mode: MapMode.HYBRID,
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
// [END 3d-popover-location]
