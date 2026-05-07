/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// Remove these disables once the PlacesLibrary typing is fixed:

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// [START maps_place_autocomplete_element]
async function init(): Promise<void> {
    // [START maps_place_autocomplete_element_add]
    // Request needed libraries.
    // @ts-expect-error - when this gets addressed also remove the global eslint-disables above
    const { PlaceAutocompleteElement } =
        await google.maps.importLibrary('places');
    // Create the input HTML element, and append it.
    const placeAutocomplete = new PlaceAutocompleteElement();
    document.body.appendChild(placeAutocomplete);
    // [END maps_place_autocomplete_element_add]

    // Inject HTML UI.
    const selectedPlaceTitle = document.createElement('p');
    selectedPlaceTitle.textContent = '';
    document.body.appendChild(selectedPlaceTitle);

    const selectedPlaceInfo = document.createElement('pre');
    selectedPlaceInfo.textContent = '';
    document.body.appendChild(selectedPlaceInfo);

    // [START maps_place_autocomplete_element_listener]
    // Add the gmp-placeselect listener, and display the results.
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
    // [END maps_place_autocomplete_element_listener]
}

void init();
// [END maps_place_autocomplete_element]
