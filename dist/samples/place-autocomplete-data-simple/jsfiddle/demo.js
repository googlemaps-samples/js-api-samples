'use strict';
/**
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function init() {
    const { AutocompleteSessionToken, AutocompleteSuggestion } =
        await google.maps.importLibrary('places');

    // Add an initial request body.

    const request = {
        input: 'Tadi',
        locationRestriction: {
            west: -122.44,
            north: 37.8,
            east: -122.39,
            south: 37.78,
        },
        origin: { lat: 37.7893, lng: -122.4039 },
        includedPrimaryTypes: ['restaurant'],
        language: 'en-US',
        region: 'us',
    };

    // Create a session token.
    const token = new AutocompleteSessionToken();
    // Add the token to the request.
    request.sessionToken = token;

    // Fetch autocomplete suggestions.
    const { suggestions } =
        await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

    const title = document.getElementById('title');
    title.appendChild(
        document.createTextNode(
            'Query predictions for "' + request.input + '":'
        )
    );

    const resultsElement = document.getElementById('results');

    for (const suggestion of suggestions) {
        const placePrediction = suggestion.placePrediction;

        // Create a new list element.
        const listItem = document.createElement('li');

        listItem.appendChild(
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            document.createTextNode(placePrediction.text.toString())
        );
        resultsElement.appendChild(listItem);
    }

    const place = suggestions[0].placePrediction.toPlace(); // Get first predicted place.

    await place.fetchFields({
        fields: ['displayName', 'formattedAddress'],
    });

    const placeInfo = document.getElementById('prediction');
    placeInfo.textContent = `First predicted place: ${place.displayName}: ${place.formattedAddress}`;
}

void init();
