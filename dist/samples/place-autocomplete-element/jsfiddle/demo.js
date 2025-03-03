/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

async function initMap() {
    
    // Request needed libraries.
    //@ts-ignore
    await google.maps.importLibrary("places");
    // Create the input HTML element, and append it.
    //@ts-ignore
    const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement();
    //@ts-ignore
    document.body.appendChild(placeAutocomplete);
    
    // Inject HTML UI.
    const selectedPlaceTitle = document.createElement('p');
    selectedPlaceTitle.textContent = '';
    document.body.appendChild(selectedPlaceTitle);
    const selectedPlaceInfo = document.createElement('pre');
    selectedPlaceInfo.textContent = '';
    document.body.appendChild(selectedPlaceInfo);
    
    // Add the gmp-placeselect listener, and display the results.
    //@ts-ignore
    placeAutocomplete.addEventListener('gmp-placeselect', async ({ place }) => {
        await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });
        selectedPlaceTitle.textContent = 'Selected Place:';
        selectedPlaceInfo.textContent = JSON.stringify(place.toJSON(), /* replacer */ null, /* space */ 2);
    });
    
}
initMap();
export {};
