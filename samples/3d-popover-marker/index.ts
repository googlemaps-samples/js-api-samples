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
// [START maps_3d_popover_marker]
async function init() {
    const { AltitudeMode, Map3DElement, Marker3DInteractiveElement, MapMode, PopoverElement } = await google.maps.importLibrary("maps3d");

    const map = new Map3DElement({
        center: { lat: 37.8204, lng: -122.4783, altitude: 0.407 }, range: 4000, tilt: 74, heading: 38,
        mode: MapMode.HYBRID,
    });

    // Popovers can only be added to interactive Markers
    const interactiveMarker = new Marker3DInteractiveElement({
        altitudeMode: AltitudeMode.ABSOLUTE,
        position: { lat: 37.819852, lng: -122.478549, altitude: 100 }
    });

    const popover = new PopoverElement({
        open: false,
        positionAnchor: interactiveMarker,
    });

    popover.append('Golden Gate Bridge');

    interactiveMarker.addEventListener('gmp-click', (event) => {
        // toggle the marker to the other state (unlee you are clicking on the marker itself when it reopens it)
        popover.open = !popover.open;
    });

    map.append(interactiveMarker);
    map.append(popover);

    document.body.append(map);

}

init();
// [END maps_3d_popover_marker]
