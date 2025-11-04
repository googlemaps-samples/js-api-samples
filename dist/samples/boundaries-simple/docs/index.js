"use strict";
/**
* @license
* Copyright 2025 Google LLC. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
/**
* This is the simplest possible data-driven styling example.
* It calls the styling function with a Place ID.
*/
// [START maps_boundaries_simple]
let featureLayer;
async function initMap() {
    // Request needed libraries.
    await google.maps.importLibrary("maps");
    // Get the gmp-map element.
    const mapElement = document.querySelector("gmp-map");
    // Get the inner map.
    const innerMap = mapElement.innerMap;
    // [START maps_boundaries_simple_get_layer]
    // Get the feature layer.
    featureLayer = innerMap.getFeatureLayer(google.maps.FeatureType.LOCALITY);
    // [END maps_boundaries_simple_get_layer]
    // [START maps_boundaries_simple_style_single]
    // Define a style with purple fill and border.
    const featureStyleOptions = {
        strokeColor: '#810FCB',
        strokeOpacity: 1.0,
        strokeWeight: 3.0,
        fillColor: '#810FCB',
        fillOpacity: 0.5
    };
    // Apply the style to a single boundary.
    featureLayer.style = (options) => {
        if (options.feature.placeId == 'ChIJ0zQtYiWsVHkRk8lRoB1RNPo') { // Hana, HI
            return featureStyleOptions;
        }
    };
    // [END maps_boundaries_simple_style_single]
}
initMap();
// [END maps_boundaries_simple]
