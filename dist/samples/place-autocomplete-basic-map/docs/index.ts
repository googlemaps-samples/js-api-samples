/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */


// [START maps_place_autocomplete_basic_map]
const mapContainer = document.getElementById("map-container") as any;
const autocompleteElement = document.querySelector('gmp-basic-place-autocomplete') as any;
const detailsElement = document.querySelector('gmp-place-details-compact') as any;
const mapElement = document.querySelector('gmp-map') as any;
const advancedMarkerElement = document.querySelector('gmp-advanced-marker') as any;

let center = { lat: 40.749933, lng: -73.98633 }; // New York City

async function initMap(): Promise<void>{
  //@ts-ignore
  const {BasicPlaceAutocompleteElement, PlaceDetailsElement} = await google.maps.importLibrary('places');
    //@ts-ignore
  const {AdvancedMarkerElement} = await google.maps.importLibrary('marker');
    //@ts-ignore
  const {LatLngBounds} = await google.maps.importLibrary('core');
      
  // Set the initial map location and autocomplete location bias
  mapElement.center = center
  autocompleteElement.locationBias = center;

  // Get the underlying google.maps.Map object to add listeners
  const map = mapElement.innerMap;

  // Add the listener tochange locationBias to locationRestriction when the map moves
  map.addListener('bounds_changed', () => {
    autocompleteElement.locationBias = null;
    autocompleteElement.locationRestriction = map.getBounds();
    console.log("bias changed to restriction")
  });

  // [START maps_place_autocomplete_basic_map_listener]
  // Add the listener to update the Place Request element when the user selects a prediction
  autocompleteElement.addEventListener('gmp-select', async (event) => {
    const placeDetailsRequest = document.querySelector('gmp-place-details-place-request') as any;
    placeDetailsRequest.place = event.place.id;
  });
  // [END maps_place_autocomplete_basic_map_listener]

  // Add the listener to update the marker when the Details element loads
  detailsElement.addEventListener('gmp-load', async () => {
    const location = detailsElement.place.location;
    detailsElement.style.display = "block"
    advancedMarkerElement.position = location;
    advancedMarkerElement.content = detailsElement;
    if (detailsElement.place.viewport) {
        map.fitBounds(detailsElement.place.viewport);
    } else {
        map.setCenter(location);
        map.setZoom(17);
    }
  });
}

initMap();
// [END maps_place_autocomplete_basic_map]

