/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_place_autocomplete_map]
let map: google.maps.Map;
let marker: google.maps.marker.AdvancedMarkerElement;
let infoWindow: google.maps.InfoWindow;
let center = { lat: 40.749933, lng: -73.98633 }; // New York City
async function initMap(): Promise<void> {
    // Request needed libraries.
    //@ts-ignore
    const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary("marker"),
        google.maps.importLibrary("places")
      ]);

    // Initialize the map.
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center,
        zoom: 13,
        mapId: '4504f8b37365c3d0',
        mapTypeControl: false,
    });
    // [START maps_place_autocomplete_map_add]
    //@ts-ignore
    const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement();
    //@ts-ignore
    placeAutocomplete.id = 'place-autocomplete-input';
    placeAutocomplete.locationBias = center;

    const card = document.getElementById('place-autocomplete-card') as HTMLElement;
    //@ts-ignore
    card.appendChild(placeAutocomplete);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
    // [END maps_place_autocomplete_map_add]

    // Create the marker and infowindow.
    marker = new google.maps.marker.AdvancedMarkerElement({
        map,
    });
    
    infoWindow = new google.maps.InfoWindow({});

    // [START maps_place_autocomplete_map_listener]
    // Add the gmp-placeselect listener, and display the results on the map.
    //@ts-ignore
    placeAutocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
        const place = placePrediction.toPlace();
        await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });

        // If the place has a geometry, then present it on a map.
        if (place.viewport) {
            map.fitBounds(place.viewport);
        } else {
            map.setCenter(place.location);
            map.setZoom(17);
        }

        let content = '<div id="infowindow-content">' +
        '<span id="place-displayname" class="title">' + place.displayName + '</span><br />' +
        '<span id="place-address">' + place.formattedAddress + '</span>' +
        '</div>';

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
        map,
        anchor: marker,
        shouldFocus: false,
    });
}

initMap();
// [END maps_place_autocomplete_map]
