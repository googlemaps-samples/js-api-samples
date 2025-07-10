"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_search_text_compact] */
const mapContainer = document.getElementById("map-container");
const placeSearch = document.querySelector("gmp-place-search");
const placeSearchQuery = document.querySelector("gmp-place-text-search-request");
const queryInput = document.querySelector(".query-input");
const searchButton = document.querySelector(".search-button");
const detailsContainer = document.getElementById("details-container");
const placeDetails = document.querySelector("gmp-place-details-compact");
const placeRequest = document.querySelector("gmp-place-details-place-request");
const warningMsg = document.querySelector(".warning");
let markers = {};
let previousSearchQuery = '';
let gMap;
let placeDetailsPopup;
let AdvancedMarkerElement;
let LatLngBounds;
let LatLng;
async function init() {
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    await google.maps.importLibrary("places");
    //@ts-ignore
    ({ AdvancedMarkerElement } = await google.maps.importLibrary("marker"));
    //@ts-ignore
    ({ LatLngBounds, LatLng } = await google.maps.importLibrary("core"));
    let mapOptions = {
        center: { lat: 37.422, lng: -122.085 },
        zoom: 2,
        mapTypeControl: false,
        clickableIcons: false,
        mapId: '2439f449ff38ce55'
    };
    gMap = new Map(mapContainer, mapOptions);
    placeDetailsPopup = new AdvancedMarkerElement({
        map: null,
        content: placeDetails,
        zIndex: 100
    });
    findCurrentLocation();
    gMap.addListener('click', (e) => {
        hidePlaceDetailsPopup();
    });
    searchButton.addEventListener("click", searchPlaces);
    queryInput.addEventListener("keydown", (event) => {
        if (event.key == 'Enter') {
            event.preventDefault();
            searchPlaces();
        }
    });
    placeSearch.addEventListener("gmp-select", ({ place }) => {
        if (markers[place.id]) {
            markers[place.id].click();
        }
    });
}
function searchPlaces() {
    if (queryInput.value.trim() === previousSearchQuery) {
        return;
    }
    previousSearchQuery = queryInput.value.trim();
    warningMsg.style.display = 'none';
    placeDetailsPopup.map = null;
    for (const markerId in markers) {
        if (Object.prototype.hasOwnProperty.call(markers, markerId)) {
            markers[markerId].map = null;
        }
    }
    markers = {};
    if (queryInput.value) {
        mapContainer.style.height = '75vh';
        placeSearch.style.display = 'block';
        placeSearchQuery.textQuery = queryInput.value;
        placeSearchQuery.locationBias = gMap.getBounds();
        placeSearch.addEventListener('gmp-load', addMarkers, { once: true });
    }
}
async function addMarkers() {
    const bounds = new LatLngBounds();
    if (placeSearch.places.length > 0) {
        placeSearch.places.forEach((place) => {
            let marker = new AdvancedMarkerElement({
                map: gMap,
                position: place.location
            });
            marker.metadata = { id: place.id };
            markers[place.id] = marker;
            bounds.extend(place.location);
            marker.addListener('click', (event) => {
                placeRequest.place = place;
                placeDetails.style.display = 'block';
                placeDetailsPopup.position = place.location;
                placeDetailsPopup.map = gMap;
                gMap.fitBounds(place.viewport, { top: 200, left: 100 });
            });
            gMap.setCenter(bounds.getCenter());
            gMap.fitBounds(bounds);
        });
    }
    else {
        warningMsg.style.display = "block";
    }
}
async function findCurrentLocation() {
    //@ts-ignore
    const { LatLng } = await google.maps.importLibrary("core");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const pos = new LatLng(position.coords.latitude, position.coords.longitude);
            gMap.panTo(pos);
            gMap.setZoom(16);
        }, () => {
            console.log('The Geolocation service failed.');
            gMap.setZoom(16);
            //@ts-ignore
        });
    }
    else {
        console.log("Your browser doesn't support geolocation");
        gMap.setZoom(16);
    }
}
function hidePlaceDetailsPopup() {
    if (placeDetailsPopup.map) {
        placeDetailsPopup.map = null;
        placeDetails.style.display = 'none';
    }
}
init();
/* [END maps_ui_kit_place_search_text_compact] */
