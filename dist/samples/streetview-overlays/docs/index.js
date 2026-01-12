/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_streetview_overlays]
let panorama;
let innerMap;
async function initMap() {
    // Request needed libraries.
    const { Map } = (await google.maps.importLibrary('maps'));
    // Set the location of Astor Place.
    const astorPlace = { lat: 40.729884, lng: -73.990988 };
    const mapElement = document.querySelector('gmp-map');
    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
    });
    document
        .getElementById('toggle')
        .addEventListener('click', toggleStreetView);
    const cafeIcon = document.createElement('img');
    cafeIcon.src = new URL('./public/cafe_icon.svg', import.meta.url).href;
    const dollarIcon = document.createElement('img');
    dollarIcon.src = new URL('./public/bank_icon.svg', import.meta.url).href;
    const busIcon = document.createElement('img');
    busIcon.src = new URL('./public/bus_icon.svg', import.meta.url).href;
    // Set up the markers on the map
    const cafeMarker = new google.maps.Marker({
        position: { lat: 40.730031, lng: -73.991428 },
        map: innerMap,
        title: 'Cafe',
        icon: cafeIcon.src,
    });
    const bankMarker = new google.maps.Marker({
        position: { lat: 40.729681, lng: -73.991138 },
        map: innerMap,
        title: 'Bank',
        icon: dollarIcon.src,
    });
    const busMarker = new google.maps.Marker({
        position: { lat: 40.729559, lng: -73.990741 },
        map: innerMap,
        title: 'Bus Stop',
        icon: busIcon.src,
    });
    // We get the map's default panorama and set up some defaults.
    // Note that we don't yet set it visible.
    panorama = innerMap.getStreetView(); // TODO fix type
    panorama.setPosition(astorPlace);
    panorama.setPov(
    /** @type {google.maps.StreetViewPov} */ {
        heading: 265,
        pitch: 0,
    });
}
function toggleStreetView() {
    const toggle = panorama.getVisible();
    if (toggle == false) {
        panorama.setVisible(true);
    }
    else {
        panorama.setVisible(false);
    }
}
initMap();
export {};
// [END maps_streetview_overlays]
