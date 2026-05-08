'use strict';
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// Remove these disables once the PlacesLibrary typing is fixed:

async function init() {
    // Request needed libraries.

    const { PlaceAutocompleteElement } =
        await google.maps.importLibrary('places');
    // Create the input HTML element, and append it.
    const placeAutocomplete = new PlaceAutocompleteElement();
    document.body.appendChild(placeAutocomplete);

    // Inject HTML UI.
    const selectedPlaceTitle = document.createElement('p');
    selectedPlaceTitle.textContent = '';
    document.body.appendChild(selectedPlaceTitle);

    const selectedPlaceInfo = document.createElement('pre');
    selectedPlaceInfo.textContent = '';
    document.body.appendChild(selectedPlaceInfo);

    // Add the gmp-select listener, and display the results.
    placeAutocomplete.addEventListener(
        'gmp-select',
        async ({ placePrediction }) => {
            const place = placePrediction.toPlace();
            await place.fetchFields({
                fields: ['displayName', 'formattedAddress', 'location'],
            });
            selectedPlaceTitle.textContent = 'Selected Place:';
            selectedPlaceInfo.textContent = JSON.stringify(
                place.toJSON(),
                /* replacer */ null,
                /* space */ 2
            );
        }
    );
}

void init();
