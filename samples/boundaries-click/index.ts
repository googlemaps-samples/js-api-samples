/**
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_boundaries_click_event]
let innerMap;
let featureLayer;
let infoWindow;
let lastInteractedFeatureIds = [];
let lastClickedFeatureIds = [];

// [START maps_boundaries_click_event_handler]
function handleClick(/* MouseEvent */ e) {
    lastClickedFeatureIds = e.features.map((f) => f.placeId);
    lastInteractedFeatureIds = [];
    featureLayer.style = applyStyle;
    createInfoWindow(e);
}

function handleMouseMove(/* MouseEvent */ e) {
    lastInteractedFeatureIds = e.features.map((f) => f.placeId);
    featureLayer.style = applyStyle;
}
// [END maps_boundaries_click_event_handler]

async function initMap() {
    // Request needed libraries.
    const { Map, InfoWindow } = (await google.maps.importLibrary(
        'maps'
    )) as google.maps.MapsLibrary;

    // Get the gmp-map element.
    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;

    // Get the inner map.
    innerMap = mapElement.innerMap;

    // Set map options.
    innerMap.setOptions({
        mapTypeControl: false,
    });

    //[START maps_boundaries_click_event_add_layer]
    // Add the feature layer.
    featureLayer = innerMap.getFeatureLayer(
        google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_2
    );

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
    //[END maps_boundaries_click_event_add_layer]

    // Create the infowindow.
    infoWindow = new InfoWindow({});
    // Apply style on load, to enable clicking.
    featureLayer.style = applyStyle;
}

// Helper function for the infowindow.
async function createInfoWindow(event) {
    let feature = event.features[0];
    if (!feature.placeId) return;

    // Update the info window.
    // Get the place instance from the selected feature.
    const place = await feature.fetchPlace();

    // Create a new div to hold the text content.
    let content = document.createElement('div');
    
    // Get the text values.
    let nameText = document.createElement('span');
    nameText.textContent = `Display name: ${place.displayName}`;
    let placeIdText = document.createElement('span');
    placeIdText.textContent = `Place ID: ${feature.placeId}`;
    let featureTypeText = document.createElement('span');
    featureTypeText.textContent = `Feature type: ${feature.featureType}`;
    
    // Append the text to the div.
    content.appendChild(nameText);
    content.appendChild(document.createElement('br'));
    content.appendChild(placeIdText);
    content.appendChild(document.createElement('br'));
    content.appendChild(featureTypeText);

    updateInfoWindow(content, event.latLng);
}

// [START maps_boundaries_click_event_style]
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
function applyStyle(/* FeatureStyleFunctionOptions */ params) {
    const placeId = params.feature.placeId;
    //@ts-ignore
    if (lastClickedFeatureIds.includes(placeId)) {
        return styleClicked;
    }
    //@ts-ignore
    if (lastInteractedFeatureIds.includes(placeId)) {
        return styleMouseMove;
    }
    return styleDefault;
}
// [END maps_boundaries_click_event_style]

// Helper function to create an info window.
function updateInfoWindow(content, center) {
    infoWindow.setContent(content);
    infoWindow.setPosition(center);
    infoWindow.open({
        map: innerMap,
        shouldFocus: false,
    });
}

initMap();
//  [END maps_boundaries_click_event]
