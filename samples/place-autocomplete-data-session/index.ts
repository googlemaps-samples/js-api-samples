/**
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_place_autocomplete_data_session]
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;
let innerMap;
let marker: google.maps.marker.AdvancedMarkerElement | undefined;
let titleElement: HTMLElement;
let resultsContainerElement: HTMLElement;
let inputElement: HTMLInputElement;
let tokenStatusElement: HTMLElement;
let request: any;

let newestRequestId: number = 0;

async function initMap() {
    await google.maps.importLibrary('maps') as google.maps.MapsLibrary;

    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapId: 'DEMO_MAP_ID',
        mapTypeControl: false,
    });

    google.maps.event.addListenerOnce(innerMap, 'idle', async () => {
        // Add an initial request body.
        request = {
            input: '',
            locationRestriction: innerMap.getBounds(),
            origin: innerMap.getCenter(),
            includedPrimaryTypes: ['restaurant', 'cafe', 'museum', 'park'],
            language: 'en-US',
            region: 'us',
        };
        await refreshToken(request);
    });

    titleElement = document.getElementById('title') as HTMLElement;
    resultsContainerElement = document.getElementById('results') as HTMLElement;
    inputElement = document.querySelector('input') as HTMLInputElement;
    tokenStatusElement = document.getElementById('token-status') as HTMLElement;

    inputElement.addEventListener('input', makeAutocompleteRequest);
}

async function makeAutocompleteRequest(inputEvent) {
    const { AutocompleteSuggestion } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;

    if (!request.sessionToken) {
        await refreshToken(request);
    }

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
    const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

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
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;

    await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location'],
    });


    const placeText = document.createTextNode(`${place.displayName}: ${place.formattedAddress}`);
    resultsContainerElement.replaceChildren(placeText);
    titleElement.innerText = 'Selected Place:';
    inputElement.value = '';
    
    request.sessionToken = null;
    tokenStatusElement.textContent = 'Token: Terminated';

    // Remove the previous marker, if it exists.
    if (marker) {
        marker.map = null;
    }

    // Create a new marker.
    marker = new AdvancedMarkerElement({
        map: innerMap,
        position: place.location,
        title: place.displayName,
    });

    // Center the map on the selected place.
    innerMap.setCenter(place.location);
    innerMap.setZoom(15);
}

// Helper function to refresh the session token.
async function refreshToken(request) {
    const { AutocompleteSessionToken } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;
    // Create a new session token and add it to the request.
    request.sessionToken = new AutocompleteSessionToken();

    // Indicate that a new token is active.
    tokenStatusElement.textContent = 'Token: Active';

    console.log(`Newest request ID: ${newestRequestId}, session token: ${request.sessionToken}`);
}

initMap();

// [END maps_place_autocomplete_data_session]
