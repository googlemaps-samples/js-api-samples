"use strict";
/*
* @license
* Copyright 2025 Google LLC. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/

const placeAutocompleteElement = document.querySelector('gmp-basic-place-autocomplete');
const placeDetailsElement = document.querySelector('gmp-place-details-compact');
const placeDetailsParent = placeDetailsElement.parentElement;
const mapDiv = document.getElementById('map-container');
const center = { lat: 40.749933, lng: -73.98633 }; // New York City
async function initMap() {
    // Asynchronously load required libraries from the Google Maps JS API.
    await google.maps.importLibrary('places');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
    const { Map, InfoWindow } = await google.maps.importLibrary('maps');
    // Set the initial location bias for the autocomplete element.
    placeAutocompleteElement.locationBias = center;
    // Create the map object with specified options.
    const map = new Map(mapDiv, {
        zoom: 12,
        center: center,
        mapId: 'DEMO_MAP_ID',
        clickableIcons: false,
        mapTypeControl: false,
        streetViewControl: false,
    });
    // Create an advanced marker to show the location of a selected place.
    const advancedMarkerElement = new AdvancedMarkerElement({
        map: map,
    });
    // Create an InfoWindow to hold the place details component.
    const infoWindow = new InfoWindow({
        minWidth: 360,
        disableAutoPan: true,
        closeButton: false,
        headerDisabled: true,
        pixelOffset: new google.maps.Size(0, -10),
    });
    
    // Event listener for when a place is selected from the autocomplete list.
    placeAutocompleteElement.addEventListener('gmp-select', (event) => {
        // Reset marker and InfoWindow, and prepare the details element.
        placeDetailsParent.appendChild(placeDetailsElement);
        advancedMarkerElement.position = null;
        infoWindow.close();
        // Request details for the selected place.
        const placeDetailsRequest = placeDetailsElement.querySelector('gmp-place-details-place-request');
        placeDetailsRequest.place = event.place.id;
    });
    
    // Event listener for when the place details have finished loading.
    placeDetailsElement.addEventListener('gmp-load', () => {
        const location = placeDetailsElement.place.location;
        // Position the marker and open the InfoWindow at the place's location.
        advancedMarkerElement.position = location;
        infoWindow.setContent(placeDetailsElement);
        infoWindow.open({
            map,
            anchor: advancedMarkerElement,
        });
        map.setCenter(location);
        placeDetailsElement.focus();
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
            radius: 10000, // 10km in meters
        });
    });
}
initMap();

