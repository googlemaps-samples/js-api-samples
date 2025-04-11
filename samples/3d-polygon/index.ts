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
// [START maps_3d_polygon]
async function init() {
    const { Map3DElement, MapMode, Polygon3DElement } = await google.maps.importLibrary("maps3d");
    
    const map3DElement = new Map3DElement({
        center: { lat: 40.6842, lng: -74.0019, altitude: 1000 },
        heading: 340,
        tilt: 70,
        mode: MapMode.HYBRID,
    });

    const polygonOptions = {
        strokeColor: "#0000ff80",
        strokeWidth: 8,
        fillColor: "#ff000080",
        drawsOccludedSegments: false,
    }

    const examplePolygon = new google.maps.maps3d.Polygon3DElement(polygonOptions);

    examplePolygon.outerCoordinates = [
        { lat: 40.7144, lng: -74.0208 },
        { lat: 40.6993, lng: -74.019 },
        { lat: 40.7035, lng: -74.0004 },
        { lat: 40.7144, lng: -74.0208 }
    ];

    map3DElement.append(examplePolygon);

    document.body.append(map3DElement);
}

init();
// [END maps_3d_polygon]
