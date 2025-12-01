"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_details_compact] */
// Use querySelector to select elements for interaction.
const mapContainer = document.getElementById('map-container');
const placeDetails = document.querySelector('gmp-place-details-compact');
const placeDetailsRequest = document.querySelector('gmp-place-details-place-request');
let gMap;
let marker;
async function initMap() {
    const { PlaceDetailsCompactElement, PlaceDetailsPlaceRequestElement } = (await google.maps.importLibrary('places'));
    const { Map } = (await google.maps.importLibrary('maps'));
    const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker'));
    gMap = new Map(mapContainer, { mapId: 'DEMO_MAP_ID' });
    marker = new AdvancedMarkerElement({ map: gMap });
    // Hide the map type control.
    gMap.setOptions({ mapTypeControl: false });
    // Set up map, marker, and infowindow once widget is loaded.
    placeDetails.style.visibility = 'visible';
    placeDetails.addEventListener('gmp-load', (event) => {
        console.log('placeDetails initialized!');
        updateMapAndMarker();
    });
    // Add an event listener to handle clicks.
    gMap.addListener('click', async (event) => {
        event.stop();
        // Fire when the user clicks on a POI.
        if (event.placeId) {
            console.log('clicked on POI');
            console.log(event.placeId);
            placeDetailsRequest.place = event.placeId;
            updateMapAndMarker();
        }
        else {
            // Fire when the user clicks the map (not on a POI).
            console.log('No place was selected.');
        }
    });
    // Function to update map, marker, and infowindow based on place details
    const updateMapAndMarker = () => {
        console.log('function called');
        if (placeDetails.place && placeDetails.place.location) {
            marker.gMap = null;
            let adjustedCenter = offsetLatLngRight(placeDetails.place.location, 0.002);
            gMap.panTo(adjustedCenter);
            gMap.setZoom(16); // Set zoom after panning if needed
            marker.content = placeDetails;
            marker.position = placeDetails.place.location;
        }
        else {
            console.log('else');
        }
    };
}
// Helper function to offset marker placement for better visual appearance.
function offsetLatLngRight(latLng, latitudeOffset) {
    const newLat = latLng.lat() + latitudeOffset;
    return new google.maps.LatLng(newLat, latLng.lng());
}
initMap();
/* [END maps_ui_kit_place_details_compact] */
