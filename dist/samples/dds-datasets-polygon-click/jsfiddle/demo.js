"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const mapElement = document.querySelector('gmp-map');
let innerMap;
let lastInteractedFeatureIds = [];
let lastClickedFeatureIds = [];
let datasetLayer;

// Note, 'globalid' is an attribute in this Dataset.
function handleClick(/* MouseEvent */ e) {
    if (e.features) {
        lastClickedFeatureIds = e.features.map((f) => f.datasetAttributes['globalid']);
    }
    datasetLayer.style = applyStyle;
}
function handleMouseMove(/* MouseEvent */ e) {
    if (e.features) {
        lastInteractedFeatureIds = e.features.map((f) => f.datasetAttributes['globalid']);
    }
    datasetLayer.style = applyStyle;
}

async function initMap() {
    // Request needed libraries.
    (await google.maps.importLibrary('maps'));
    // Get the inner map.
    innerMap = mapElement.innerMap;
    // Dataset ID for NYC park data.
    const datasetId = 'a75dd002-ad20-4fe6-af60-27cd2ed636b4';
    
    datasetLayer = innerMap.getDatasetFeatureLayer(datasetId);
    datasetLayer.style = applyStyle;
    datasetLayer.addListener('click', handleClick);
    datasetLayer.addListener('mousemove', handleMouseMove);
    // Map event listener.
    innerMap.addListener('mousemove', () => {
        // If the map gets a mousemove, that means there are no feature layers
        // with listeners registered under the mouse, so we clear the last
        // interacted feature ids.
        if (lastInteractedFeatureIds?.length) {
            lastInteractedFeatureIds = [];
            datasetLayer.style = applyStyle;
        }
    });
    
}

const styleDefault = {
    strokeColor: 'green',
    strokeWeight: 2.0,
    strokeOpacity: 1.0,
    fillColor: 'green',
    fillOpacity: 0.3,
};
const styleClicked = {
    ...styleDefault,
    strokeColor: 'blue',
    fillColor: 'blue',
    fillOpacity: 0.5,
};
const styleMouseMove = {
    ...styleDefault,
    strokeWeight: 4.0,
};
function applyStyle(/* FeatureStyleFunctionOptions */ params) {
    const datasetFeature = params.feature;
    // Note, 'globalid' is an attribute in this dataset.
    if (lastClickedFeatureIds.includes(datasetFeature.datasetAttributes['globalid'])) {
        return styleClicked;
    }
    if (lastInteractedFeatureIds.includes(datasetFeature.datasetAttributes['globalid'])) {
        return styleMouseMove;
    }
    return styleDefault;
}

initMap();

