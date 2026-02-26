/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_event_poi]
let innerMap;

async function initMap() {
    //  Request the needed libraries.
    await google.maps.importLibrary('maps');

    // Retrieve the map element.
    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;

    // Get the inner map from the map element.
    innerMap = mapElement.innerMap;

    // Create the initial info window.
    let infowindow = new google.maps.InfoWindow({});

    // Add a listener for click events on the map.
    innerMap.addListener('click', (event) => {
        // Prevent the default POI info window from showing.
        event.stop();

        // If the event has a placeId, show the info window.
        if (isIconMouseEvent(event) && event.placeId) {
            showInfoWindow(event, infowindow);
        } else {
            // Otherwise, close the info window.
            infowindow.close();
        }
    });
}

// Helper function to show the info window.
async function showInfoWindow(event: google.maps.IconMouseEvent, infowindow: google.maps.InfoWindow) {
    // Retrieve the place details for the selected POI.
    const place = await getPlaceDetails(event.placeId);

    // Assemble the info window content.
    const content = document.createElement('div');
    const address = document.createElement('div');
    const placeId = document.createElement('div');
    address.textContent = place.formattedAddress || '';
    placeId.textContent = place.id || '';
    content.append(address, placeId);

    // Create an element to use the place name as header content.
    const name = document.createElement('div');
    name.style.fontWeight = 'bold';
    name.style.fontSize = 'medium';
    name.textContent = place.displayName || '';

    // Update info window options.
    infowindow.setOptions({
        position: event.latLng,
        pixelOffset: new google.maps.Size(0, -30),
        headerContent: name,
        content: content,
    });

    innerMap.panTo(event.latLng);
    infowindow.open(innerMap);
}

// Helper function to get place details.
async function getPlaceDetails(placeId) {
    // Import the Places library.
    const { Place } = (await google.maps.importLibrary(
        'places'
    )) as google.maps.PlacesLibrary;

    // Create a Place instance with the place id and fetch the details.
    const place = new Place({ id: placeId });
    await place.fetchFields({
        fields: ['displayName', 'formattedAddress'],
    });

    // Return the place details.
    return place;
}

// Helper type guard to determine if the event is an IconMouseEvent.
function isIconMouseEvent(
    e: google.maps.MapMouseEvent | google.maps.IconMouseEvent
): e is google.maps.IconMouseEvent {
    return 'placeId' in e;
}

initMap();
// [END maps_event_poi]
