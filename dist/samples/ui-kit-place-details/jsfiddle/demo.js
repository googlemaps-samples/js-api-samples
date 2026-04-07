"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_details] */
// Use querySelector to select elements for interaction.
/* [START maps_ui_kit_place_details_query_selector] */
const map = document.querySelector('gmp-map');
const placeDetails = document.querySelector('gmp-place-details');
const placeDetailsRequest = document.querySelector('gmp-place-details-place-request');
const marker = document.querySelector('gmp-advanced-marker');
/* [END maps_ui_kit_place_details_query_selector] */
async function initMap() {
    // Request needed libraries.
    await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('places'),
    ]);
    // Hide the map type control.
    map.innerMap.setOptions({ mapTypeControl: false });
    // Function to update map and marker based on place details
    const updateMapAndMarker = () => {
        if (placeDetails.place && placeDetails.place.location) {
            map.innerMap.panTo(placeDetails.place.location);
            map.innerMap.setZoom(16); // Set zoom after panning if needed
            marker.position = placeDetails.place.location;
            marker.collisionBehavior =
                google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL;
            marker.style.display = 'block';
        }
    };
    // Set up map once widget is loaded.
    placeDetails.addEventListener('gmp-load', (event) => {
        updateMapAndMarker();
    });
    /* [START maps_ui_kit_place_details_event] */
    // Add an event listener to handle clicks.
    map.innerMap.addListener('click', async (event) => {
        marker.position = null;
        event.stop();
        if (event.placeId) {
            // Fire when the user clicks a POI.
            placeDetailsRequest.place = event.placeId;
            updateMapAndMarker();
        }
        else {
            // Fire when the user clicks the map (not on a POI).
            console.log('No place was selected.');
            marker.style.display = 'none';
        }
    });
}
/* [END maps_ui_kit_place_details_event] */
initMap();
/* [END maps_ui_kit_place_details] */
