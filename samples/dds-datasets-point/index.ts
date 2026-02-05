/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_dds_datasets_point]
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;
let innerMap;

async function initMap() {
    // Request needed libraries.
    await google.maps.importLibrary('maps') as google.maps.MapsLibrary;

    // Get the inner map.
    innerMap = mapElement.innerMap;

    // Add the data legend.
    //makeLegend(innerMap);

    // Dataset ID for squirrel dataset.
    //const datasetId = 'a99635b0-5e73-4b2a-8ae3-cb40f4b7f47e';
    //const datasetLayer = innerMap.getDatasetFeatureLayer(datasetId);
    //datasetLayer.style = setStyle;
}

initMap();
// [END maps_dds_datasets_point]
