'use strict';
/**
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

let innerMap;
let featureLayer;
let infoWindow;
let lastInteractedFeatureIds = [];
let lastClickedFeatureIds = [];

function handleClick(event) {
    lastClickedFeatureIds = event.features.map((f) => f.placeId);
    lastInteractedFeatureIds = [];
    featureLayer.style = applyStyle;
    void createInfoWindow(event);
}

function handleMouseMove(event) {
    lastInteractedFeatureIds = event.features.map((f) => f.placeId);
    featureLayer.style = applyStyle;
}

async function init() {
    // Request needed libraries.
    const { InfoWindow } = await google.maps.importLibrary('maps');

    // Get the gmp-map element.
    const mapElement = document.querySelector('gmp-map');

    // Get the inner map.
    innerMap = mapElement.innerMap;

    // Set map options.
    innerMap.setOptions({
        mapTypeControl: false,
    });

    // Add the feature layer.
    featureLayer = innerMap.getFeatureLayer('ADMINISTRATIVE_AREA_LEVEL_2');

    // Add the event listeners for the feature layer.
    featureLayer.addListener('click', handleClick);
    featureLayer.addListener('mousemove', handleMouseMove);

    // Map event listener.
    innerMap.addListener('mousemove', () => {
        // If the map gets a mousemove, that means there are no feature layers
        // with listeners registered under the mouse, so we clear the last
        // interacted feature ids.
        if (lastInteractedFeatureIds?.length) {
            lastInteractedFeatureIds = [];
            featureLayer.style = applyStyle;
        }
    });

    // Create the infoWindow.
    infoWindow = new InfoWindow();
    // Apply style on load, to enable clicking.
    featureLayer.style = applyStyle;
}

// Helper function for the infoWindow.
async function createInfoWindow(event) {
    const feature = event.features[0];
    if (!feature.placeId) return;

    // Update the info window.
    // Get the place instance from the selected feature.
    const place = await feature.fetchPlace();

    // Create a new div to hold the text content.
    const content = document.createElement('div');

    // Get the text values.
    const nameText = document.createElement('span');
    nameText.textContent = `Display name: ${place.displayName}`;
    const placeIdText = document.createElement('span');
    placeIdText.textContent = `Place ID: ${feature.placeId}`;
    const featureTypeText = document.createElement('span');
    featureTypeText.textContent = `Feature type: ${feature.featureType}`;

    // Append the text to the div.
    content.appendChild(nameText);
    content.appendChild(document.createElement('br'));
    content.appendChild(placeIdText);
    content.appendChild(document.createElement('br'));
    content.appendChild(featureTypeText);

    updateInfoWindow(content, event.latLng);
}

// Define styles.
// Stroke and fill with minimum opacity value.
const styleDefault = {
    strokeColor: '#810FCB',
    strokeOpacity: 1.0,
    strokeWeight: 2.0,
    fillColor: 'white',
    fillOpacity: 0.1, // Polygons must be visible to receive events.
};
// Style for the clicked polygon.
const styleClicked = {
    ...styleDefault,
    fillColor: '#810FCB',
    fillOpacity: 0.5,
};
// Style for polygon on mouse move.
const styleMouseMove = {
    ...styleDefault,
    strokeWeight: 4.0,
};

// Apply styles using a feature style function.
function applyStyle(params) {
    const placeId = params.feature.placeId;
    if (lastClickedFeatureIds.includes(placeId)) {
        return styleClicked;
    }
    if (lastInteractedFeatureIds.includes(placeId)) {
        return styleMouseMove;
    }
    return styleDefault;
}

// Helper function to create an info window.
function updateInfoWindow(content, center) {
    infoWindow.setContent(content);
    infoWindow.setPosition(center);
    infoWindow.open({
        map: innerMap,
        shouldFocus: false,
    });
}

void init();
