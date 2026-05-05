'use strict';
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

const mapElement = document.querySelector('gmp-map');
const placeAutocomplete = document.querySelector('gmp-place-autocomplete');

async function initMap() {
    // Request needed libraries.
    await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('places'),
    ]);

    // Get the inner map from the map element.
    const innerMap = mapElement.innerMap;

    innerMap.setOptions({
        mapTypeControl: false,
    });

    const dataLayer = innerMap.getDatasetFeatureLayer(
        'bcf6598c-7603-4698-9493-9e927d8d3d38'
    );
    dataLayer.style = layerStyle;

    placeAutocomplete.includedPrimaryTypes = ['(regions)'];

    placeAutocomplete.addEventListener(
        'gmp-select',
        async ({ placePrediction }) => {
            if (!placePrediction) return;
            const place = placePrediction.toPlace();
            await place.fetchFields({
                fields: ['location'],
            });
            if (!place.location) {
                return;
            }
            innerMap.setCenter(place.location);
            innerMap.setZoom(9);
        }
    );
}
initMap();
// [END maps_3d_coverage_map]
