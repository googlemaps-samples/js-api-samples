/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_coverage_map]
const layerStyle = {
    strokeColor: '#2a76ff',
    strokeWeight: 2,
    strokeOpacity: 1,
    fillColor: '#2a76ff',
    fillOpacity: 0.3,
};

const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;
const placeAutocomplete = document.querySelector(
    'gmp-place-autocomplete'
) as google.maps.places.PlaceAutocompleteElement;

async function initMap() {
    // Request needed libraries.
    await google.maps.importLibrary('maps'); as google.maps.MapsLibrary;
    await google.maps.importLibrary('places') as google.maps.PlacesLibrary;

    // Get the inner map from the map element.
    const innerMap = mapElement.innerMap;

    innerMap.setOptions({
        mapTypeControl: false,
    });

    const dataLayer = innerMap.getDatasetFeatureLayer(
        'bcf6598c-7603-4698-9493-9e927d8d3d38'
    );
    dataLayer.style = layerStyle;

    //prettier-ignore
    //@ts-ignore
    placeAutocomplete.addEventListener("gmp-select", async ({ placePrediction }) => {
        if (!placePrediction) return;
        const place = placePrediction.toPlace();
        await place.fetchFields({
            fields: ["location"]
        });
        if (!place.location) {
            return;
        }
        innerMap.setCenter(place.location);
        innerMap.setZoom(9);
    });
}
initMap();
// [END maps_3d_coverage_map]
