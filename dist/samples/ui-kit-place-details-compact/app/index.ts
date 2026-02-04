'use strict';
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_details_compact] */
// Use querySelector to select elements for interaction.
/* [START maps_ui_kit_place_details_compact_query_selector] */
const map = document.querySelector('gmp-map') as google.maps.MapElement;
const placeDetails = document.querySelector('gmp-place-details-compact') as any;
const placeDetailsRequest = document.querySelector(
    'gmp-place-details-place-request'
) as any;
const marker = document.querySelector(
    'gmp-advanced-marker'
) as google.maps.marker.AdvancedMarkerElement;
/* [END maps_ui_kit_place_details_compact_query_selector] */
async function initMap(): Promise<void> {
    // Request needed libraries.
    Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('places'),
    ]);
    const { InfoWindow } = (await google.maps.importLibrary(
        'maps'
    )) as google.maps.MapsLibrary;

    await window.customElements.whenDefined('gmp-map');
    // Set the inner map options.
    map.innerMap.setOptions({
        mapTypeControl: false,
        streetViewControl: false,
    });

    await window.customElements.whenDefined('gmp-advanced-marker');
    marker.collisionBehavior =
        google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL;

    const infoWindow = new InfoWindow();
    infoWindow.addListener('close', () => {
        marker.position = null;
    });

    const showInfoWindow = () => {
        if (infoWindow.isOpen) return;
        infoWindow.setContent(placeDetails);
        infoWindow.open({ anchor: marker });
    };

    placeDetails.addEventListener('gmp-load', (event) => {
        // For the initial load case, with no user click, we fall back to the place's location, and ensure the map has a center set and the InfoWindow is show.
        // (The clicked POI LatLng will be a more natural marker position, when available.)
        if (!map.center) {
            map.center = marker.position = placeDetails.place.location;
            showInfoWindow();
        }
    });

    /* [START maps_ui_kit_place_details_compact_event] */
    // Add an event listener to handle clicks.
    map.innerMap.addListener('click', async (event) => {
        event.stop();

        if (event.placeId) {
            // When the user clicks a POI.
            marker.position = event.latLng;
            placeDetailsRequest.place = event.placeId;
            showInfoWindow();
        } else {
            // When the user clicks the map (not on a POI).
            marker.position = null;
            placeDetailsRequest.place = null;
            console.log('No place was selected.');
        }
    });
}
/* [END maps_ui_kit_place_details_compact_event] */
initMap();
/* [END maps_ui_kit_place_details_compact] */
