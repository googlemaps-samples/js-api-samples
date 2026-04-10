"use strict";
/**
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_place_autocomplete_data_session]
const mapElement = document.querySelector('gmp-map');
let innerMap;
let marker;
let titleElement = document.querySelector('.title');
let resultsContainerElement = document.querySelector('.results');
let inputElement = document.querySelector('input');
let tokenStatusElement = document.querySelector('.token-status');
let newestRequestId = 0;
let tokenCount = 0;
// Create an initial request body.
const request = {
    input: '',
    includedPrimaryTypes: [
        'restaurant',
        'cafe',
        'museum',
        'park',
        'botanical_garden',
    ],
};
async function init() {
    await google.maps.importLibrary('maps');
    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
    });
    // Update request center and bounds when the map bounds change.
    google.maps.event.addListener(innerMap, 'bounds_changed', async () => {
        request.locationRestriction = innerMap.getBounds();
        request.origin = innerMap.getCenter();
    });
    inputElement.addEventListener('input', makeAutocompleteRequest);
}
async function makeAutocompleteRequest(inputEvent) {
    // To avoid race conditions, store the request ID and compare after the request.
    const requestId = ++newestRequestId;
    const { AutocompleteSuggestion } = (await google.maps.importLibrary('places'));
    if (!inputEvent.target?.value) {
        titleElement.textContent = '';
        resultsContainerElement.replaceChildren();
        return;
    }
    // Add the latest char sequence to the request.
    request.input = inputEvent.target.value;
    // Fetch autocomplete suggestions and show them in a list.
    const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
    // If the request has been superseded by a newer request, do not render the output.
    if (requestId !== newestRequestId)
        return;
    titleElement.innerText = `Place predictions for "${request.input}"`;
    // Clear the list first.
    resultsContainerElement.replaceChildren();
    for (const suggestion of suggestions) {
        const placePrediction = suggestion.placePrediction;
        if (!placePrediction) {
            continue;
        }
        // Create a link for the place, add an event handler to fetch the place.
        // We are using a button element to take advantage of its a11y capabilities.
        const placeButton = document.createElement('button');
        placeButton.addEventListener('click', () => {
            onPlaceSelected(placePrediction.toPlace());
        });
        placeButton.textContent = placePrediction.text.toString();
        placeButton.classList.add('place-button');
        // Create a new list item element.
        const li = document.createElement('li');
        li.appendChild(placeButton);
        resultsContainerElement.appendChild(li);
    }
}
// Event handler for clicking on a suggested place.
async function onPlaceSelected(place) {
    const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker'));
    await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location'],
    });
    resultsContainerElement.textContent = `${place.displayName}: ${place.formattedAddress}`;
    titleElement.textContent = 'Selected Place:';
    inputElement.value = '';
    await refreshToken();
    // Remove the previous marker, if it exists.
    if (marker) {
        marker.remove();
    }
    // Create a new marker.
    marker = new AdvancedMarkerElement({
        map: innerMap,
        position: place.location,
        title: place.displayName,
    });
    // Center the map on the selected place.
    if (place.location) {
        innerMap.setCenter(place.location);
        innerMap.setZoom(15);
    }
}
// Helper function to refresh the session token.
async function refreshToken() {
    const { AutocompleteSessionToken } = (await google.maps.importLibrary('places'));
    // Increment the token counter.
    tokenCount++;
    // Create a new session token and add it to the request.
    request.sessionToken = new AutocompleteSessionToken();
    tokenStatusElement.textContent = `Session token count: ${tokenCount}`;
}
init();
// [END maps_place_autocomplete_data_session]
