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
    await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('places'),
    ]);

    // Set the map options.
    map.innerMap.setOptions({
        mapTypeControl: false,
        streetViewControl: false,
    });

    // Set up the info window.
    const infoWindow = new google.maps.InfoWindow({});

    // Function to update map and marker based on place details
    const updateMapAndMarker = () => {
        if (placeDetails.place && placeDetails.place.location) {
            const placeViewport = placeDetails.place.viewport;
            map.innerMap.fitBounds(placeViewport, 0);
            marker.position = placeDetails.place.location;
            marker.collisionBehavior =
                google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL;
            marker.style.display = 'block';
            infoWindow.close();
            infoWindow.setContent(placeDetails);
            infoWindow.open({ map: map.innerMap, anchor: marker });
        }
    };

    // Set up map once widget is loaded.
    placeDetails.addEventListener('gmp-load', (event) => {
        updateMapAndMarker();
    });

    /* [START maps_ui_kit_place_details_compact_event] */
    // Add an event listener to handle clicks.
    map.innerMap.addListener('click', async (event) => {
        marker.position = null;
        event.stop();
        if (event.placeId) {
            // Fire when the user clicks a POI.
            placeDetailsRequest.place = event.placeId;
            updateMapAndMarker();
        } else {
            // Fire when the user clicks the map (not on a POI).
            console.log('No place was selected.');
            marker.style.display = 'none';
            infoWindow.close();
        }
    });
}
/* [END maps_ui_kit_place_details_compact_event] */

initMap();
/* [END maps_ui_kit_place_details_compact] */
