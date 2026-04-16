"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function initMap() {
    await Promise.all([
        google.maps.importLibrary("maps"),
        google.maps.importLibrary("marker"),
        google.maps.importLibrary("geocoding"),
    ]);
    const geocoder = new google.maps.Geocoder();
    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;
    document.getElementById("submit").addEventListener("click", () => {
        geocodeAddress(geocoder, innerMap);
    });
}
function geocodeAddress(geocoder, map) {
    geocoder
        .geocode({
        address: "483 George St.",
        componentRestrictions: {
            country: "AU",
            postalCode: "2000",
        },
    })
        .then(({ results }) => {
        map.setCenter(results[0].geometry.location);
        new google.maps.marker.AdvancedMarkerElement({
            map,
            position: results[0].geometry.location,
        });
    })
        .catch((e) => window.alert("Geocode was not successful for the following reason: " + e));
}
initMap();

