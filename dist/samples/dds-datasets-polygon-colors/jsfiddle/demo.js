"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const mapElement = document.querySelector('gmp-map');
let innerMap;

function setStyle(/* FeatureStyleFunctionOptions */ params) {
    const datasetFeature = params.feature;
    // 'typecategory' is an attribute in this Dataset.
    const typeCategory = datasetFeature.datasetAttributes['typecategory'];
    switch (typeCategory) {
        case 'Undeveloped': // Color undeveloped areas blue.
            return /* FeatureStyleOptions */ {
                strokeColor: 'blue',
                strokeWeight: 2,
                strokeOpacity: 1,
                fillColor: 'blue',
                fillOpacity: 0.3,
            };
            break;
        case 'Parkway': // Color historical house sites red.
            return /* FeatureStyleOptions */ {
                strokeColor: 'red',
                strokeWeight: 2,
                strokeOpacity: 1,
                fillColor: 'red',
                fillOpacity: 0.5,
            };
            break;
        default: // Color other type categories green.
            return /* FeatureStyleOptions */ {
                strokeColor: 'green',
                strokeWeight: 2,
                strokeOpacity: 1,
                fillColor: 'green',
                fillOpacity: 0.3,
            };
            break;
    }
}

async function initMap() {
    // Request needed libraries.
    await google.maps.importLibrary("maps");
    // Get the inner map.
    innerMap = mapElement.innerMap;
    // Dataset ID for NYC park data.
    const datasetId = 'a75dd002-ad20-4fe6-af60-27cd2ed636b4';
    const datasetLayer = innerMap.getDatasetFeatureLayer(datasetId);
    datasetLayer.style = setStyle;
}
initMap();

