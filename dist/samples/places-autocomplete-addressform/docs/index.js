"use strict";
/**
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_places_autocomplete_addressform]
// This sample uses the Places Autocomplete widget to:
// 1. Help the user select a place
// 2. Retrieve the address components associated with that place
// 3. Populate the form fields with those address components.
// This sample requires the Places library, Maps JavaScript API.
let placeAutocomplete;
let address1Field;
let address2Field;
let postalField;
async function initAutocomplete() {
    const { Place, Autocomplete } = (await google.maps.importLibrary('places'));
    placeAutocomplete = document.querySelector('gmp-place-autocomplete');
    address1Field = document.querySelector('#address1');
    address2Field = document.querySelector('#address2');
    postalField = document.querySelector('#postcode');
    const saveButton = document.querySelector('.my-button');
    placeAutocomplete.focus();
    // Handle user selection on the autocomplete widget.
    placeAutocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
        fillInAddress(placePrediction);
    });
    saveButton.addEventListener('click', () => {
        // Display a message when the Save button is clicked.
        alert('In a real application, this would save the address details.');
    });
}
// [START maps_places_autocomplete_addressform_fillform]
async function fillInAddress(placePrediction) {
    // The placePrediction object does not have all the details needed
    // for the form, so we'll call fetchFields to get the place details.
    const { Place } = (await google.maps.importLibrary('places'));
    const place = placePrediction.toPlace();
    await place.fetchFields({ fields: ['addressComponents'] });
    let address1 = '';
    let postcode = '';
    if (!place.addressComponents) {
        return;
    }
    // Populate form fields with address component data.
    // The field is only updated if the types array includes
    // the specified type-value.
    for (const component of place.addressComponents) {
        if (component.types.includes('street_address')) {
            address1 = `${component.longText} ${address1}`;
        }
        if (component.types.includes('street_number')) {
            address1 = `${component.longText} ${address1}`;
        }
        if (component.types.includes('route')) {
            address1 += component.shortText;
        }
        if (component.types.includes('postal_code')) {
            postcode = `${component.longText}${postcode}`;
        }
        if (component.types.includes('postal_code_suffix')) {
            postcode = `${postcode}-${component.longText}`;
        }
        if (component.types.includes('locality')) {
            document.querySelector('#locality').value =
                component.longText;
        }
        if (component.types.includes('administrative_area_level_1')) {
            document.querySelector('#state').value =
                component.shortText;
        }
        if (component.types.includes('country')) {
            document.querySelector('#country').value =
                component.longText;
        }
    }
    address1Field.value = address1;
    postalField.value = postcode;
    // After filling the form with address components from the Autocomplete
    // prediction, set cursor focus on the second address line to encourage
    // entry of subpremise information such as apartment, unit, or floor number.
    address2Field.focus();
}
// [END maps_places_autocomplete_addressform_fillform]
initAutocomplete();
// [END maps_places_autocomplete_addressform]
