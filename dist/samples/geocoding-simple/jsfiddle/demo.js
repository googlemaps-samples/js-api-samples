'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

let geocoder;
let mapElement;
let innerMap;
let marker;
let responseDiv;
let response;

async function initMap() {
    //  Request the needed libraries.
    const [
        { Map },
        { Geocoder },
        { AdvancedMarkerElement },
        { ControlPosition },
    ] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('geocoding'),
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('core'),
    ]);

    // Get the gmp-map element.
    mapElement = document.querySelector('gmp-map');

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

    const inputText = document.getElementById('address');
    const submitButton = document.getElementById('submit');
    const clearButton = document.getElementById('clear');
    responseDiv = document.getElementById('response-container');
    response = document.getElementById('response');

    marker = new AdvancedMarkerElement({});

    innerMap.addListener('click', (e) => {
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

async function geocode(request) {
    clear();
    const { LatLng } = await google.maps.importLibrary('core');

    geocoder
        .geocode(request)
        .then((result) => {
            const { results } = result;
            innerMap.setCenter(results[0].geometry.location);
            marker.position = new LatLng(results[0].geometry.location);
            mapElement.append(marker);
            responseDiv.style.display = 'block';
            response.innerText = JSON.stringify(result, null, 2);
            return results;
        })
        .catch((e) => {
            alert('Geocode was not successful for the following reason: ' + e);
        });
}

initMap();
