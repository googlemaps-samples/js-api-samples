"use strict";
/*
* @license
* Copyright 2025 Google LLC. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
// @ts-nocheck
// [START maps_3d_places_autocomplete]
let map = null;
async function init() {
    const { Map3DElement } = await google.maps.importLibrary("maps3d");
    map = new Map3DElement({
        center: { lat: 0, lng: 0, altitude: 16000000 },
        tilt: 0,
        range: 0,
        heading: 0,
        roll: 0,
        mode: 'HYBRID',
        gestureHandling: "COOPERATIVE"
    });
    document.body.append(map);
    initAutocomplete();
}
async function initAutocomplete() {
    const { PlaceAutocompleteElement } = await google.maps.importLibrary("places");
    const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement();
    placeAutocomplete.id = 'place-autocomplete-input';
    const card = document.getElementById('pac-container');
    card.appendChild(placeAutocomplete);
    placeAutocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
        const place = placePrediction.toPlace();
        await place.fetchFields({ fields: ['displayName', 'location', 'id'] });
        // If the place has a geometry, then present it on a map.
        if (!place.location) {
            window.alert("No viewport for input: " + place.displayName);
            return;
        }
        flyToPlace(place);
    });
}
const flyToPlace = async (place) => {
    const { AltitudeMode, Polyline3DElement, Polygon3DElement, Marker3DElement } = await google.maps.importLibrary("maps3d");
    const location = place.location;
    // We need to find the elevation for the point so we place the marker at 50m above the elevation.
    const elevation = await getElevationforPoint(location);
    const marker = new Marker3DElement({
        position: { lat: location.lat(), lng: location.lng(), altitude: elevation + 50 },
        altitudeMode: AltitudeMode.ABSOLUTE,
        extruded: true,
        label: place.displayName,
    });
    // Add the marker.
    map.append(marker);
    // Fly to the marker.
    map.flyCameraTo({
        endCamera: {
            center: { lat: location.lat(), lng: location.lng(), altitude: elevation + 50 },
            tilt: 65,
            heading: 0,
            range: 1000
        },
        durationMillis: 10000,
    });
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
// [END maps_3d_places_autocomplete]
