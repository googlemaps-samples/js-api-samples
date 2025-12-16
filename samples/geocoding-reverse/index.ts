/**
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_geocoding_reverse]
//let innerMap;
let marker;

async function initMap() {
    //  Request the needed libraries.
    const [{ Map, InfoWindow }, { Geocoder }, { AdvancedMarkerElement }] =
        await Promise.all([
            google.maps.importLibrary(
                'maps'
            ) as Promise<google.maps.MapsLibrary>,
            google.maps.importLibrary(
                'geocoding'
            ) as Promise<google.maps.GeocodingLibrary>,
            google.maps.importLibrary(
                'marker'
            ) as Promise<google.maps.MarkerLibrary>,
        ]);

    // Get the gmp-map element.
    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;

    // Get the inner map.
    let innerMap = mapElement.innerMap;

    // Get the latlng input box.
    const latLngQuery = document.getElementById('latlng') as HTMLInputElement;

    // Get the submit button.
    const submitButton = document.getElementById('submit') as HTMLElement;

    // Set the cursor to crosshair.
    innerMap.setOptions({
        draggableCursor: 'crosshair',
        zoom: 13,
    });

    // Create a marker for re-use.
    marker = new AdvancedMarkerElement({
        map: innerMap,
    });

    const geocoder = new Geocoder();
    const infowindow = new InfoWindow();

    // Add a click event listener to the submit button.
    submitButton.addEventListener('click', () => {
        geocodeLatLng(geocoder, innerMap, infowindow);
    });

    // Add a click event listener to the map.
    innerMap.addListener('click', (event) => {
        latLngQuery.value = `${event.latLng.lat()}, ${event.latLng.lng()}`;
        geocodeLatLng(geocoder, innerMap, infowindow);
    });

    // Make an initial request upon loading.
    geocodeLatLng(geocoder, innerMap, infowindow);
}

async function geocodeLatLng(
    geocoder: google.maps.Geocoder,
    map: google.maps.Map,
    infowindow: google.maps.InfoWindow
) {
    const input = (document.getElementById('latlng') as HTMLInputElement).value;
    const latlngStr = input.split(',', 2);
    const latlng = {
        lat: parseFloat(latlngStr[0]),
        lng: parseFloat(latlngStr[1]),
    };

    geocoder
        .geocode({ location: latlng })
        .then((response) => {
            if (response.results[0]) {
                marker.position = latlng;
                map.setCenter(latlng);
                infowindow.setContent(response.results[0].formatted_address);
                infowindow.open(map, marker);
            } else {
                window.alert('No results found');
            }
        })
        .catch((e) => window.alert('Geocoder failed due to: ' + e));
}

initMap();
// [END maps_geocoding_reverse]
