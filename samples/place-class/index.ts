/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_place_class]
let map: google.maps.Map;
let infoWindow;
const center = { lat: 32.7360353, lng: -117.1509849 }; // San Diego Zoo

async function initMap() {
    const { Map, InfoWindow } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

    map = new Map(document.getElementById('map') as HTMLElement, {
        center: center,
        zoom: 14,
        mapId: 'DEMO_MAP_ID',
    });

    infoWindow = new InfoWindow();
    getPlaceDetails();
}

// [START maps_place_class_fetchfields]
async function getPlaceDetails() {
    const { Place } =  await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    // Use place ID to create a new Place instance.
    const place = new Place({
        id: 'ChIJyYB_SZVU2YARR-I1Jjf08F0', // San Diego Zoo
    });

    // Call fetchFields, passing the desired data fields.
    await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location', 'googleMapsLinks'] });

    // Add an Advanced Marker
    const marker = new AdvancedMarkerElement({
        map,
        position: place.location,
        title: place.displayName,
    });

    // Assemble the info window content.
    //@ts-ignore
    const content = `${place.formattedAddress}<br/>${place.id}<br/><a href="${place.googleMapsLinks.placeURI}">View Details on Google Maps</a>`;

    // Display an info window.
    infoWindow.setHeaderContent(place.displayName);
    infoWindow.setContent(content);
    infoWindow.open({
        map,
        anchor: marker,
        shouldFocus: false,
    });
}
// [END maps_place_class_fetchfields]

initMap();
// [END maps_place_class]