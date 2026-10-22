/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_advanced_place_details_compact] */
// Use querySelector to select elements for interaction.
/* [START maps_ui_kit_advanced_place_details_compact_query_selector] */
const map = document.querySelector<google.maps.MapElement>('gmp-map')!;
const placeDetails = document.querySelector<
    HTMLElement & { place?: google.maps.places.Place }
>('gmp-advanced-place-details-compact')!;
const placeDetailsRequest = document.querySelector<HTMLElement>(
    'gmp-place-details-place-request'
)!;
const marker = document.querySelector<google.maps.marker.AdvancedMarkerElement>(
    'gmp-advanced-marker'
)!;
/* [END maps_ui_kit_advanced_place_details_compact_query_selector] */
async function init(): Promise<void> {
    // Request needed libraries.
    void Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('places'),
    ]);
    const { InfoWindow } = await google.maps.importLibrary('maps');

    await window.customElements.whenDefined('gmp-map');
    // Set the inner map options.
    map.innerMap.setOptions({
        mapTypeControl: false,
        streetViewControl: false,
    });

    await window.customElements.whenDefined('gmp-advanced-marker');
    marker.collisionBehavior = 'REQUIRED_AND_HIDES_OPTIONAL';

    const infoWindow = new InfoWindow();
    infoWindow.addListener('close', () => {
        marker.position = null;
    });

    const showInfoWindow = () => {
        if (infoWindow.isOpen) return;
        infoWindow.setContent(placeDetails);
        infoWindow.open({ anchor: marker });
    };

    placeDetails.addEventListener('gmp-load', () => {
        // For the initial load case, with no user click, we fall back to the place's location, and ensure the map has a center set and the InfoWindow is show.
        // (The clicked POI LatLng will be a more natural marker position, when available.)
        if (!map.center && placeDetails.place?.location) {
            map.center = marker.position = placeDetails.place.location;
            showInfoWindow();
        }
    });

    /* [START maps_ui_kit_advanced_place_details_compact_event] */
    // Add an event listener to handle clicks.
    map.innerMap.addListener(
        'click',
        (event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
            event.stop();

            if ('placeId' in event && event.placeId) {
                // When the user clicks a POI.
                marker.position = event.latLng;
                placeDetailsRequest.setAttribute(
                    'place',
                    `places/${event.placeId}`
                );
                showInfoWindow();
            } else {
                // When the user clicks the map (not on a POI).
                marker.position = null;
                placeDetailsRequest.removeAttribute('place');
                console.log('No place was selected.');
            }
        }
    );
}
/* [END maps_ui_kit_advanced_place_details_compact_event] */
void init();
/* [END maps_ui_kit_advanced_place_details_compact] */
