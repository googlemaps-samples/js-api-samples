"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

let map;
let markers = {};
let infoWindow;
async function initMap() {
    const { Map, InfoWindow } = (await google.maps.importLibrary('maps'));
    const center = { lat: 37.4161493, lng: -122.0812166 };
    map = new Map(document.getElementById('map'), {
        center: center,
        zoom: 11,
        mapTypeControl: false,
        mapId: 'DEMO_MAP_ID',
    });
    const textInput = document.getElementById('text-input');
    const textInputButton = document.getElementById('text-input-button');
    const card = document.getElementById('text-input-card');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
    textInputButton.addEventListener('click', () => {
        findPlaces(textInput.value);
    });
    textInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            findPlaces(textInput.value);
        }
    });
    infoWindow = new google.maps.InfoWindow();
}
async function findPlaces(query) {
    const { Place } = (await google.maps.importLibrary('places'));
    const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker'));
    
    const request = {
        textQuery: query,
        fields: ['displayName', 'location', 'businessStatus'],
        includedType: '', // Restrict query to a specific type (leave blank for any).
        useStrictTypeFiltering: true,
        locationBias: map.center,
        isOpenNow: true,
        language: 'en-US',
        maxResultCount: 8,
        minRating: 1, // Specify a minimum rating.
        region: 'us',
    };
    const { places } = await Place.searchByText(request);
    
    if (places.length) {
        const { LatLngBounds } = (await google.maps.importLibrary('core'));
        const bounds = new LatLngBounds();
        // First remove all existing markers.
        for (const id in markers) {
            markers[id].map = null;
        }
        markers = {};
        // Loop through and get all the results.
        places.forEach((place) => {
            const marker = new AdvancedMarkerElement({
                map,
                position: place.location,
                title: place.displayName,
            });
            markers[place.id] = marker;
            marker.addListener('gmp-click', () => {
                map.panTo(place.location);
                updateInfoWindow(place.displayName, place.id, marker);
            });
            if (place.location != null) {
                bounds.extend(place.location);
            }
        });
        map.fitBounds(bounds);
    }
    else {
        console.log('No results');
    }
}
// Helper function to create an info window.
async function updateInfoWindow(title, content, anchor) {
    infoWindow.setContent(content);
    infoWindow.setHeaderContent(title);
    infoWindow.open({
        map,
        anchor,
        shouldFocus: false,
    });
}
initMap();

