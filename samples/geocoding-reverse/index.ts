/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_geocoding_reverse]
let marker;

async function initMap() {
    //  Request the needed libraries.
    const [{ InfoWindow }, { Geocoder }, { AdvancedMarkerElement }] =
        await Promise.all([
            google.maps.importLibrary('maps'),
            google.maps.importLibrary('geocoding'),
            google.maps.importLibrary('marker'),
        ]);

    // Get the gmp-map element.
    const mapElement = document.querySelector('gmp-map')!;

    // Get the inner map.
    const innerMap = mapElement.innerMap;

    // Get the latlng input box.
    const latLngQuery = document.getElementById('latlng') as HTMLInputElement;

    // Get the submit button.
    const submitButton = document.getElementById('submit') as HTMLElement;

    // Set the cursor to crosshair.
    innerMap.setOptions({
        draggableCursor: 'crosshair',
        zoom: 13,
        mapTypeControl: false,
    });

    // Create a marker for re-use.
    marker = new AdvancedMarkerElement({
        map: innerMap,
    });

    marker.anchorTop = '40px';

    const geocoder = new Geocoder();
    const infoWindow = new InfoWindow();

    // Add a click event listener to the submit button.
    submitButton.addEventListener('click', () => {
        void geocodeLatLng(geocoder, innerMap, infoWindow);
    });

    // Add a click event listener to the map.
    innerMap.addListener('click', (event) => {
        latLngQuery.value = `${event.latLng.lat()}, ${event.latLng.lng()}`;
        void geocodeLatLng(geocoder, innerMap, infoWindow);
    });

    // Make an initial request upon loading.
    void geocodeLatLng(geocoder, innerMap, infoWindow);
}

async function geocodeLatLng(
    geocoder: google.maps.Geocoder,
    map: google.maps.Map,
    infoWindow: google.maps.InfoWindow
) {
    const input = (document.getElementById('latlng') as HTMLInputElement).value;
    const latlngStr = input.split(',', 2);
    const latlng = {
        lat: parseFloat(latlngStr[0]),
        lng: parseFloat(latlngStr[1]),
    };

    try {
        const { results } = await geocoder.geocode({ location: latlng });

        if (results[0]) {
            marker.position = latlng;
            map.setCenter(latlng);
            infoWindow.setContent(results[0].formatted_address);
            infoWindow.open(map, marker);
        } else {
            window.alert('No results found');
        }
    } catch (e) {
        window.alert('Geocoder failed due to: ' + String(e));
    }
}

void initMap();
// [END maps_geocoding_reverse]
