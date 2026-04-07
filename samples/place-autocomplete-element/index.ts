/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_place_autocomplete_element]
async function initMap(): Promise<void> {
    // [START maps_place_autocomplete_element_add]
    // Request needed libraries.
    (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary;
    // Create the input HTML element, and append it.
    const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement(
        {}
    );
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
    //prettier-ignore
    //@ts-ignore
    placeAutocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
        const place = placePrediction.toPlace();
        await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });
        selectedPlaceTitle.textContent = 'Selected Place:';
        selectedPlaceInfo.textContent = JSON.stringify(
            place.toJSON(), /* replacer */ null, /* space */ 2);
    });
    // [END maps_place_autocomplete_element_listener]
}

initMap();
// [END maps_place_autocomplete_element]
