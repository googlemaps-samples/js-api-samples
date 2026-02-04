/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_dds_datasets_polyline]
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;
let innerMap;
async function initMap() {
    // Request needed libraries.
    (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

    // Get the inner map.
    innerMap = mapElement.innerMap;

    // Dataset ID for Seattle Bridges
    const datasetId = '2438ee30-5366-4e84-82b7-a0d4dd1893fa';
    const datasetLayer = innerMap.getDatasetFeatureLayer(datasetId);

    // [START maps_dds_datasets_polyline_style_function]
    // Apply style to all features.
    datasetLayer.style = { strokeColor: 'green', strokeWeight: 4 };
    // [END maps_dds_datasets_polyline_style_function]
}

initMap();
// [END maps_dds_datasets_polyline]
