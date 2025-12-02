"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_place_autocomplete_map]
const mapElement = document.querySelector('gmp-map');
const placeAutocomplete = document.querySelector('gmp-place-autocomplete');
let innerMap;
let marker;
let infoWindow;
let center = { lat: 40.749933, lng: -73.98633 }; // New York City
async function initMap() {
    // Request needed libraries.
    const [] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('places'),
    ]);
    // [START maps_place_autocomplete_map_add]
    // Get the inner map.
    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
    });
    // Use the bounds_changed event to restrict results to the current map bounds.
    google.maps.event.addListener(innerMap, 'bounds_changed', async () => {
        placeAutocomplete.locationRestriction = innerMap.getBounds();
    });
    // [END maps_place_autocomplete_map_add]
    // Create the marker and infowindow.
    marker = new google.maps.marker.AdvancedMarkerElement({
        map: innerMap,
    });
    infoWindow = new google.maps.InfoWindow({});
    // [START maps_place_autocomplete_map_listener]
    // Add the gmp-placeselect listener, and display the results on the map.
    //prettier-ignore
    //@ts-ignore
    placeAutocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
        const place = placePrediction.toPlace();
        await place.fetchFields({
            fields: ['displayName', 'formattedAddress', 'location'],
        });
        // If the place has a geometry, then present it on a map.
        if (place.viewport) {
            innerMap.fitBounds(place.viewport);
        }
        else {
            innerMap.setCenter(place.location);
            innerMap.setZoom(17);
        }
        let content = document.createElement('div');
        let nameText = document.createElement('span');
        nameText.textContent = place.displayName;
        content.appendChild(nameText);
        content.appendChild(document.createElement('br'));
        let addressText = document.createElement('span');
        addressText.textContent = place.formattedAddress;
        content.appendChild(addressText);
        updateInfoWindow(content, place.location);
        marker.position = place.location;
    });
    // [END maps_place_autocomplete_map_listener]
}
// Helper function to create an info window.
function updateInfoWindow(content, center) {
    infoWindow.setContent(content);
    infoWindow.setPosition(center);
    infoWindow.open({
        map: innerMap,
        anchor: marker,
        shouldFocus: false,
    });
}
initMap();
// [END maps_place_autocomplete_map]
