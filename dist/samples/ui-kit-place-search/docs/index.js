/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_search] */
/* [START maps_ui_kit_place_search_query_selectors] */
const map = document.querySelector("gmp-map");
const placeList = document.querySelector("gmp-place-list");
const typeSelect = document.querySelector(".type-select");
const placeDetails = document.querySelector("gmp-place-details");
let marker = document.querySelector('gmp-advanced-marker');
/* [END maps_ui_kit_place_search_query_selectors] */
let markers = {};
let infowindow;
let mapCenter;
async function initMap() {
    await google.maps.importLibrary("places");
    const { InfoWindow } = await google.maps.importLibrary("maps");
    const { spherical } = await google.maps.importLibrary("geometry");
    infowindow = new google.maps.InfoWindow;
    function getContainingCircle(bounds) {
        const diameter = spherical.computeDistanceBetween(bounds.getNorthEast(), bounds.getSouthWest());
        return { center: bounds.getCenter(), radius: diameter / 2 };
    }
    findCurrentLocation();
    map.innerMap.setOptions({
        mapTypeControl: false,
        clickableIcons: false,
    });
    /* [START maps_ui_kit_place_search_event] */
    typeSelect.addEventListener("change", (event) => {
        // First remove all existing markers.
        for (marker in markers) {
            console.log(marker);
            markers[marker].map = null;
        }
        markers = {};
        if (typeSelect.value) {
            placeList.configureFromSearchNearbyRequest({
                locationRestriction: getContainingCircle(map.innerMap.getBounds()),
                includedPrimaryTypes: [typeSelect.value],
            }).then(addMarkers);
            placeList.addEventListener("gmp-placeselect", ({ place }) => {
                markers[place.id].click();
            });
        }
    });
    /* [END maps_ui_kit_place_search_event] */
}
async function addMarkers() {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { LatLngBounds } = await google.maps.importLibrary("core");
    const bounds = new LatLngBounds();
    if (placeList.places.length > 0) {
        placeList.places.forEach((place) => {
            let marker = new AdvancedMarkerElement({
                map: map.innerMap,
                position: place.location
            });
            markers[place.id] = marker;
            bounds.extend(place.location);
            marker.addListener('gmp-click', (event) => {
                if (infowindow.isOpen) {
                    infowindow.close();
                }
                placeDetails.configureFromPlace(place);
                placeDetails.style.width = "350px";
                infowindow.setOptions({
                    content: placeDetails
                });
                infowindow.open({
                    anchor: marker,
                    map: map.innerMap
                });
                placeDetails.addEventListener('gmp-load', () => {
                    map.innerMap.fitBounds(place.viewport, { top: placeDetails.offsetHeight || 206, left: 200 });
                });
            });
            map.innerMap.setCenter(bounds.getCenter());
            map.innerMap.fitBounds(bounds);
        });
    }
}
async function findCurrentLocation() {
    const { LatLng } = await google.maps.importLibrary("core");
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
window.initMap = initMap;
export {};
