/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_geocoding_simple]
let geocoder: google.maps.Geocoder;
let mapElement;
let innerMap;
let marker;
let responseDiv;
let response;

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
    mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;

    // Get the inner map.
    innerMap = mapElement.innerMap;

    // Set map options.
    innerMap.setOptions({
        mapTypeControl: false,
        fullscreenControl: false,
        cameraControlOptions: {
            position: google.maps.ControlPosition.INLINE_START_BLOCK_END,
        },
        draggableCursor: 'crosshair',
    });

    geocoder = new google.maps.Geocoder();

    const inputText = document.getElementById('address') as HTMLInputElement;
    const submitButton = document.getElementById('submit') as HTMLInputElement;
    const clearButton = document.getElementById('clear') as HTMLInputElement;
    responseDiv = document.getElementById('response-container') as HTMLDivElement;
    response = document.getElementById('response') as HTMLPreElement;

    marker = new google.maps.marker.AdvancedMarkerElement({});

    innerMap.addListener('click', (e: google.maps.MapMouseEvent) => {
        geocode({ location: e.latLng });
    });

    submitButton.addEventListener('click', () =>
        geocode({ address: inputText.value })
    );

    clearButton.addEventListener('click', () => {
        clear();
    });

    clear();
}

async function clear() {
    marker.setMap(null);
    responseDiv.style.display = 'none';
}

// [START maps_geocoding_simple_request]
async function geocode(request: google.maps.GeocoderRequest) {
    clear();

    geocoder
        .geocode(request)
        .then((result) => {
            const { results } = result;
            innerMap.setCenter(results[0].geometry.location);
            marker.position = new google.maps.LatLng(results[0].geometry.location);
            mapElement.append(marker);
            responseDiv.style.display = 'block';
            response.innerText = JSON.stringify(result, null, 2);
            return results;
        })
        .catch((e) => {
            alert('Geocode was not successful for the following reason: ' + e);
        });
}
// [END maps_geocoding_simple_request]

initMap();
// [END maps_geocoding_simple]
