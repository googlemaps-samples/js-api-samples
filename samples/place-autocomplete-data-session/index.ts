/**
 * @license
 * Copyright 2024 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_place_autocomplete_data_session]
let titleElement;
let resultsContainerElement;
let inputElement;

let newestRequestId = 0;

// Add an initial request body.
const request = {
    input: '',
    locationRestriction: { west: -122.44, north: 37.8, east: -122.39, south: 37.78 },
    origin: { lat: 37.7893, lng: -122.4039 },
    includedPrimaryTypes: ['restaurant'],
    language: 'en-US',
    region: 'us',
};

function init() {
    titleElement = document.getElementById('title');
    resultsContainerElement = document.getElementById('results');
    inputElement = document.querySelector('input');
    inputElement.addEventListener('input', makeAutocompleteRequest);
    refreshToken(request);
}

async function makeAutocompleteRequest(inputEvent) {
    // Reset elements and exit if an empty string is received.
    if (inputEvent.target.value == '') {
        titleElement.innerText = '';
        resultsContainerElement.replaceChildren();
        return;
    }

    // Add the latest char sequence to the request.
    request.input = inputEvent.target.value;

    // To avoid race conditions, store the request ID and compare after the request.
    const requestId = ++newestRequestId;

    // Fetch autocomplete suggestions and show them in a list.
    // @ts-ignore
    const { suggestions } = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

    // If the request has been superseded by a newer request, do not render the output.
    if (requestId !== newestRequestId) return;

    titleElement.innerText = `Query predictions for "${request.input}"`;

    // Clear the list first.
    resultsContainerElement.replaceChildren();

    for (const suggestion of suggestions) {
        const placePrediction = suggestion.placePrediction;

        // Create a link for the place, add an event handler to fetch the place.
        const a = document.createElement('a');
        a.addEventListener('click', () => {
            onPlaceSelected(placePrediction!.toPlace());
        });
        a.innerText = placePrediction!.text.toString();

        // Create a new list item element.
        const li = document.createElement('li');
        li.appendChild(a);
        resultsContainerElement.appendChild(li);
    }
}

// Event handler for clicking on a suggested place.
async function onPlaceSelected(place) {
    await place.fetchFields({
        fields: ['displayName', 'formattedAddress'],
    });
    const placeText = document.createTextNode(`${place.displayName}: ${place.formattedAddress}`);
    resultsContainerElement.replaceChildren(placeText);
    titleElement.innerText = 'Selected Place:';
    inputElement.value = '';
    refreshToken(request);
}

// Helper function to refresh the session token.
function refreshToken(request) {
    // Create a new session token and add it to the request.
    request.sessionToken = new google.maps.places.AutocompleteSessionToken();
}

declare global {
    interface Window {
      init: () => void;
    }
  }
  window.init = init;
// [END maps_place_autocomplete_data_session]
export { };
