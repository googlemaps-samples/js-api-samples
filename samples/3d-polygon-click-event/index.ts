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
// [START maps_3d_polygon_click_event]
async function init() {
    const { Map3DElement, MapMode, Polygon3DInteractiveElement } = await google.maps.importLibrary("maps3d");

    const map = new Map3DElement({
        center: { lat: 40.6842, lng: -74.0019, altitude: 1000 },
        heading: 340,
        tilt: 70,
        mode: MapMode.HYBRID,
    });

    document.body.append(map);

    const polygonOptions = {
        strokeColor: "#0000ff80",
        strokeWidth: 8,
        fillColor: "#ff000080",
        drawsOccludedSegments: false,
    }

    const examplePolygon = new google.maps.maps3d.Polygon3DInteractiveElement(polygonOptions);

    examplePolygon.outerCoordinates = [
        { lat: 40.7144, lng: -74.0208 },
        { lat: 40.6993, lng: -74.019 },
        { lat: 40.7035, lng: -74.0004 },
        { lat: 40.7144, lng: -74.0208 }
    ];

    examplePolygon.addEventListener('gmp-click', (event) => {
        // change the color of the polygon stroke and fill colors to a random alternatives!
        event.target.fillColor = randomizeHexColor(event.target.fillColor);
        event.target.strokeColor = randomizeHexColor(event.target.fillColor);
        console.log(event);
    });

    map.append(examplePolygon);
}

function randomizeHexColor(originalHexColor) {
    console.log(originalHexColor);
    let alpha = '';
    alpha = originalHexColor.substring(7);

    // Generate random values for Red, Green, Blue (0-255)
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    console.log(r + " " + g + " " + b);

    // Convert decimal to 2-digit hex, padding with '0' if needed
    const rHex = ('0' + r.toString(16)).slice(-2);
    const gHex = ('0' + g.toString(16)).slice(-2);
    const bHex = ('0' + b.toString(16)).slice(-2);

    // Combine parts: '#' + random RGB + original Alpha (if any)
    return `#${rHex}${gHex}${bHex}${alpha}`;
}

init();
// [END maps_3d_polygon_click_event]
