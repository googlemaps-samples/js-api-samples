"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_place_autocomplete_basic_map]
const placeAutocompleteElement = document.querySelector('gmp-basic-place-autocomplete');
const placeDetailsElement = document.querySelector('gmp-place-details-compact');
const placeDetailsParent = placeDetailsElement.parentElement;
const gmpMapElement = document.querySelector('gmp-map');
async function initMap() {
    // Asynchronously load required libraries from the Google Maps JS API.
    await google.maps.importLibrary('places');
    const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker'));
    const { InfoWindow } = (await google.maps.importLibrary('maps'));
    // Get the initial center directly from the gmp-map element's property.
    const center = gmpMapElement.center;
    // Set the initial location bias for the autocomplete element.
    placeAutocompleteElement.locationBias = center;
    // Update the map object with specified options.
    const map = gmpMapElement.innerMap;
    map.setOptions({
        clickableIcons: false,
        mapTypeControl: false,
        streetViewControl: false,
    });
    // Create an advanced marker to show the location of a selected place.
    const advancedMarkerElement = new AdvancedMarkerElement({
        map: map,
        collisionBehavior: google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL,
    });
    // Create an InfoWindow to hold the place details component.
    const infoWindow = new InfoWindow({
        minWidth: 360,
        disableAutoPan: true,
        headerDisabled: true,
        pixelOffset: new google.maps.Size(0, -10),
    });
    // [START maps_place_autocomplete_basic_map_listener]
    // Event listener for when a place is selected from the autocomplete list.
    placeAutocompleteElement.addEventListener('gmp-select', (event) => {
        // Reset marker and InfoWindow, and prepare the details element.
        placeDetailsParent.appendChild(placeDetailsElement);
        placeDetailsElement.style.display = 'block';
        advancedMarkerElement.position = null;
        infoWindow.close();
        // Request details for the selected place.
        const placeDetailsRequest = placeDetailsElement.querySelector('gmp-place-details-place-request');
        placeDetailsRequest.place = event.place.id;
    });
    // [END maps_place_autocomplete_basic_map_listener]
    // Event listener for when the place details have finished loading.
    placeDetailsElement.addEventListener('gmp-load', () => {
        const location = placeDetailsElement.place
            .location;
        // Position the marker and open the InfoWindow at the place's location.
        advancedMarkerElement.position = location;
        infoWindow.setContent(placeDetailsElement);
        infoWindow.open({
            map,
            anchor: advancedMarkerElement,
        });
        map.setCenter(location);
    });
    // Event listener to close the InfoWindow when the map is clicked.
    map.addListener('click', () => {
        infoWindow.close();
        advancedMarkerElement.position = null;
    });
    // Event listener for when the map finishes moving (panning or zooming).
    map.addListener('idle', () => {
        const newCenter = map.getCenter();
        // Update the autocomplete's location bias to a 10km radius around the new map center.
        placeAutocompleteElement.locationBias = new google.maps.Circle({
            center: {
                lat: newCenter.lat(),
                lng: newCenter.lng(),
            },
            radius: 10000, // 10km in meters.
        });
    });
}
initMap();
// [END maps_place_autocomplete_basic_map]
