"use strict";
/**
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

let innerMap;
let featureLayer;
let center;
async function initMap() {
    // Load the needed libraries.
    (await google.maps.importLibrary('maps'));
    center = { lat: 41.059, lng: -124.151 }; // Trinidad, CA
    // Get the gmp-map element.
    const mapElement = document.querySelector('gmp-map');
    // Get the inner map.
    innerMap = mapElement.innerMap;
    // Get the LOCALITY feature layer.
    featureLayer = innerMap.getFeatureLayer(google.maps.FeatureType.LOCALITY);
    findBoundary();
}

async function findBoundary() {
    const request = {
        textQuery: 'Trinidad, CA',
        fields: ['id', 'location'],
        includedType: 'locality',
        locationBias: center,
    };
    const { Place } = (await google.maps.importLibrary('places'));
    const { places } = await Place.searchByText(request);
    if (places.length) {
        const place = places[0];
        styleBoundary(place.id);
        innerMap.setCenter(place.location);
    }
    else {
        console.log('No results');
    }
}
function styleBoundary(placeid) {
    // Define a style of transparent purple with opaque stroke.
    const styleFill = {
        strokeColor: '#810FCB',
        strokeOpacity: 1.0,
        strokeWeight: 3.0,
        fillColor: '#810FCB',
        fillOpacity: 0.5,
    };
    // Define the feature style function.
    featureLayer.style = (params) => {
        if (params.feature.placeId == placeid) {
            return styleFill;
        }
    };
}

initMap();

