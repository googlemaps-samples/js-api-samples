"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_search_nearby] */
/* [START maps_ui_kit_place_search_nearby_query_selectors] */
const map = document.querySelector('gmp-map');
const placeList = document.querySelector('gmp-place-list');
const typeSelect = document.querySelector('.type-select');
const placeDetails = document.querySelector('gmp-place-details');
const placeDetailsRequest = document.querySelector('gmp-place-details-place-request');
/* [END maps_ui_kit_place_search_nearby_query_selectors] */
let markers = {};
let infoWindow;
async function initMap() {
    await google.maps.importLibrary('places');
    const { LatLngBounds } = (await google.maps.importLibrary('core'));
    const { InfoWindow } = (await google.maps.importLibrary('maps'));
    const { spherical } = (await google.maps.importLibrary('geometry'));
    infoWindow = new InfoWindow();
    let marker;
    function getContainingCircle(bounds) {
        const diameter = spherical.computeDistanceBetween(bounds.getNorthEast(), bounds.getSouthWest());
        const calculatedRadius = diameter / 2;
        const cappedRadius = Math.min(calculatedRadius, 50000); // Radius cannot be more than 50000.
        return { center: bounds.getCenter(), radius: cappedRadius };
    }
    findCurrentLocation();
    map.innerMap.setOptions({
        mapTypeControl: false,
        clickableIcons: false,
    });
    /* [START maps_ui_kit_place_search_nearby_event] */
    placeDetails.addEventListener('gmp-load', (event) => {
        // Center the info window on the map.
        map.innerMap.fitBounds(placeDetails.place.viewport, {
            top: 500,
            left: 400,
        });
    });
    typeSelect.addEventListener('change', (event) => {
        // First remove all existing markers.
        for (marker in markers) {
            markers[marker].map = null;
        }
        markers = {};
        if (typeSelect.value) {
            placeList.style.display = 'block';
            placeList
                .configureFromSearchNearbyRequest({
                locationRestriction: getContainingCircle(map.innerMap.getBounds()),
                includedPrimaryTypes: [typeSelect.value],
            })
                .then(addMarkers);
            // Handle user selection in Place Details.
            placeList.addEventListener('gmp-placeselect', ({ place }) => {
                markers[place.id].click();
            });
        }
    });
    /* [END maps_ui_kit_place_search_nearby_event] */
}
async function addMarkers() {
    const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker'));
    const { LatLngBounds } = (await google.maps.importLibrary('core'));
    const bounds = new LatLngBounds();
    if (placeList.places.length > 0) {
        placeList.places.forEach((place) => {
            let marker = new AdvancedMarkerElement({
                map: map.innerMap,
                position: place.location,
            });
            markers[place.id] = marker;
            bounds.extend(place.location);
            /* [START maps_ui_kit_place_search_nearby_click_event] */
            marker.addListener('gmp-click', (event) => {
                if (infoWindow.isOpen) {
                    infoWindow.close();
                }
                placeDetailsRequest.place = place.id;
                placeDetails.style.display = 'block';
                placeDetails.style.width = '350px';
                infoWindow.setOptions({
                    content: placeDetails,
                });
                infoWindow.open({
                    anchor: marker,
                    map: map.innerMap,
                });
            });
            /* [END maps_ui_kit_place_search_nearby_click_event] */
            map.innerMap.setCenter(bounds.getCenter());
            map.innerMap.fitBounds(bounds);
        });
    }
}
async function findCurrentLocation() {
    const { LatLng } = (await google.maps.importLibrary('core'));
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const pos = new LatLng(position.coords.latitude, position.coords.longitude);
            map.innerMap.panTo(pos);
            map.innerMap.setZoom(14);
        }, () => {
            console.log('The Geolocation service failed.');
            map.innerMap.setZoom(14);
        });
    }
    else {
        console.log("Your browser doesn't support geolocation");
        map.innerMap.setZoom(14);
    }
}
initMap();
/* [END maps_ui_kit_place_search_nearby] */
