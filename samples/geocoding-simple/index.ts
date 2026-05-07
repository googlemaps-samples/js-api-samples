/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_geocoding_simple]
let geocoder: google.maps.Geocoder;
let mapElement;
let innerMap: google.maps.Map;
let marker;
let responseDiv;
let responsePre;

async function init() {
    //  Request the needed libraries.
    const [{ Geocoder }, { AdvancedMarkerElement }, { ControlPosition }] =
        await Promise.all([
            google.maps.importLibrary('geocoding'),
            google.maps.importLibrary('marker'),
            google.maps.importLibrary('core'),
            google.maps.importLibrary('maps'),
        ]);

    // Get the gmp-map element.
    mapElement = document.querySelector('gmp-map')!;

    // Get the inner map.
    innerMap = mapElement.innerMap;

    // Set map options.
    innerMap.setOptions({
        mapTypeControl: false,
        fullscreenControl: false,
        cameraControlOptions: {
            position: ControlPosition.INLINE_START_BLOCK_END,
        },
        draggableCursor: 'crosshair',
    });

    geocoder = new Geocoder();

    const inputText = document.getElementById('address') as HTMLInputElement;
    const submitButton = document.getElementById('submit') as HTMLInputElement;
    const clearButton = document.getElementById('clear') as HTMLInputElement;
    responseDiv = document.getElementById(
        'response-container'
    ) as HTMLDivElement;
    responsePre = document.getElementById('response') as HTMLPreElement;

    marker = new AdvancedMarkerElement({});

    innerMap.addListener('click', (e: google.maps.MapMouseEvent) => {
        void geocode({ location: e.latLng });
    });

    submitButton.addEventListener('click', () => {
        void geocode({ address: inputText.value });
    });

    clearButton.addEventListener('click', () => {
        clear();
    });

    clear();
}

function clear() {
    marker.setMap(null);
    responseDiv.style.display = 'none';
}

// [START maps_geocoding_simple_request]
async function geocode(request: google.maps.GeocoderRequest) {
    clear();
    const { LatLng } = await google.maps.importLibrary('core');

    try {
        const response = await geocoder.geocode(request);
        const { results } = response;

        innerMap.setCenter(results[0].geometry.location);
        marker.position = new LatLng(results[0].geometry.location);
        mapElement.append(marker);
        responseDiv.style.display = 'block';
        responsePre.innerText = JSON.stringify(response, null, 2);
        return results;
    } catch (e) {
        alert(
            'Geocode was not successful for the following reason: ' + String(e)
        );
    }
}
// [END maps_geocoding_simple_request]

void init();
// [END maps_geocoding_simple]
