"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const mapElement = document.querySelector('gmp-map');
let innerMap;

const styleOptions = {
    strokeColor: 'green',
    strokeWeight: 2,
    strokeOpacity: 1,
    fillColor: 'green',
    fillOpacity: 0.3,
};

async function initMap() {
    // Request needed libraries.
    (await google.maps.importLibrary('maps'));
    // Get the inner map.
    innerMap = mapElement.innerMap;
    
    // Dataset ID for NYC park data.
    const datasetId = 'a75dd002-ad20-4fe6-af60-27cd2ed636b4';
    const datasetLayer = innerMap.getDatasetFeatureLayer(datasetId);
    datasetLayer.style = styleOptions;
    
}
initMap();

