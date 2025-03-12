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

// [START maps3d_places]
let map3DElement = null;
async function init() {
    const { Map3DElement, MapMode } = await google.maps.importLibrary("maps3d");
    map3DElement = new Map3DElement({
        center: {lat: 0, lng: 0, altitude: 16000000},
        mode: MapMode.HYBRID,
    });
    document.body.append(map3DElement);
    initAutocomplete();
}
async function initAutocomplete() {
    const { Autocomplete } = await google.maps.importLibrary("places");
    const autocomplete = new Autocomplete(
        document.getElementById("pac-input"),
        {
            fields: [
                "geometry",
                "name",
                "place_id"
            ],
        }
    );
    autocomplete.addListener("place_changed", () => {
        //viewer.entities.removeAll();
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.viewport) {
            window.alert("No viewport for input: " + place.name);
            return;
        }
        zoomToViewport(place.geometry);
    });
}
const zoomToViewport = async (geometry) => {
    const { AltitudeMode, Polyline3DElement } = await google.maps.importLibrary("maps3d");
    let viewport = geometry.viewport;
    let locationPoints = [
        { lat: viewport.getNorthEast().lat(), lng: viewport.getNorthEast().lng() },
        { lat: viewport.getSouthWest().lat(), lng: viewport.getNorthEast().lng() },
        { lat: viewport.getSouthWest().lat(), lng: viewport.getSouthWest().lng() },
        { lat: viewport.getNorthEast().lat(), lng: viewport.getSouthWest().lng() },
        { lat: viewport.getNorthEast().lat(), lng: viewport.getNorthEast().lng() }
    ];
    let locationPolyline = new Polyline3DElement({
        altitudeMode: AltitudeMode.CLAMP_TO_GROUND,
        strokeColor: "blue",
        strokeWidth: 10,
        coordinates: locationPoints,
    });
    map3DElement.append(locationPolyline);
    console.log(locationPolyline);
    let elevation = await getElevationforPoint(geometry.location);
    if (map3DElement) {
        map3DElement.center = { lat: geometry.location.lat(), lng: geometry.location.lng(), altitude: elevation + 50 };
        map3DElement.heading = 0;
        map3DElement.range = 1000;
        map3DElement.tilt = 65;
    }
};
async function getElevationforPoint(location) {
    const { ElevationService } = await google.maps.importLibrary("elevation");
    // Get place elevation using the ElevationService.
    const elevatorService = new google.maps.ElevationService();
    const elevationResponse = await elevatorService.getElevationForLocations({
        locations: [location],
    });
    if (!(elevationResponse.results && elevationResponse.results.length)) {
        window.alert(`Insufficient elevation data for place: ${place.name}`);
        return;
    }
    const elevation = elevationResponse.results[0].elevation || 10;
    return elevation;
}
init();
// [END maps3d_places]
