"use strict";
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_place_class]
const mapElement = document.querySelector('gmp-map');
let innerMap;
let infoWindow;
async function initMap() {
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    innerMap = mapElement.innerMap;
    infoWindow = new InfoWindow();
    getPlaceDetails();
}
// [START maps_place_class_fetchfields]
async function getPlaceDetails() {
    const { Place } = await google.maps.importLibrary("places");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    // Use place ID to create a new Place instance.
    const place = new Place({
        id: 'ChIJyYB_SZVU2YARR-I1Jjf08F0', // San Diego Zoo
    });
    // Call fetchFields, passing the desired data fields.
    await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location', 'googleMapsURI'] });
    // Add an Advanced Marker
    const marker = new AdvancedMarkerElement({
        map: innerMap,
        position: place.location,
        title: place.displayName,
    });
    // Assemble the info window content.
    const content = document.createElement('div');
    const address = document.createElement('div');
    const placeId = document.createElement('div');
    address.textContent = place.formattedAddress || '';
    placeId.textContent = place.id;
    content.append(placeId, address);
    if (place.googleMapsURI) {
        const link = document.createElement('a');
        link.href = place.googleMapsURI;
        link.target = '_blank';
        link.textContent = 'View Details on Google Maps';
        content.appendChild(link);
    }
    // Display an info window.
    infoWindow.setHeaderContent(place.displayName);
    infoWindow.setContent(content);
    infoWindow.open({
        anchor: marker,
    });
}
// [END maps_place_class_fetchfields]
initMap();
// [END maps_place_class]
