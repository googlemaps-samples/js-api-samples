"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const mapElement = document.querySelector('gmp-map');
let innerMap;
async function initMap() {
    // Request needed libraries.
    (await google.maps.importLibrary('maps'));
    // Get the inner map.
    innerMap = mapElement.innerMap;
    // Dataset ID for Seattle Bridges
    const datasetId = '2438ee30-5366-4e84-82b7-a0d4dd1893fa';
    const datasetLayer = innerMap.getDatasetFeatureLayer(datasetId);
    
    // Apply style to all features.
    datasetLayer.style = { strokeColor: 'green', strokeWeight: 4 };
    
}
initMap();

