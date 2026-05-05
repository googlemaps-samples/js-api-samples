/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_control_replacement]
const mapElement = document.querySelector('gmp-map')!;
let innerMap: google.maps.Map;

async function initMap() {
    // Load the needed libraries.
    await google.maps.importLibrary('maps');

    innerMap = mapElement.innerMap;

    // Disable the default controls.
    innerMap.setOptions({
        disableDefaultUI: true,
    });

    initZoomControl(innerMap);
    initMapTypeControl(innerMap);
    initFullscreenControl(innerMap);
}

function initZoomControl(map: google.maps.Map) {
    const zoomInButton = document.querySelector('.zoom-control-in')!;
    const zoomOutButton = document.querySelector('.zoom-control-out')!;

    zoomInButton.addEventListener('click', () => {
        map.setZoom((map.getZoom() || 0) + 1);
    });

    zoomOutButton.addEventListener('click', () => {
        map.setZoom((map.getZoom() || 0) - 1);
    });
}

async function initMapTypeControl(innerMap: google.maps.Map) {
    const mapTypeControlDiv = document.querySelector('.maptype-control')!;
    const btnMap = document.querySelector('.maptype-control-map')!;
    const btnSatellite = document.querySelector('.maptype-control-satellite')!;

    btnMap.addEventListener('click', () => {
        mapTypeControlDiv.classList.add('maptype-control-is-map');
        mapTypeControlDiv.classList.remove('maptype-control-is-satellite');
        innerMap.setMapTypeId('roadmap');
    });

    btnSatellite.addEventListener('click', () => {
        mapTypeControlDiv.classList.add('maptype-control-is-satellite');
        mapTypeControlDiv.classList.remove('maptype-control-is-map');
        innerMap.setMapTypeId('hybrid');
    });
}

async function initFullscreenControl(innerMap: google.maps.Map) {
    // Get the UI elements for the fullscreen control.
    const btnFullscreen = document.querySelector('#fullscreen-button')!;

    btnFullscreen.addEventListener('click', () => {
        toggleFullScreen(mapElement);
    });
}

async function toggleFullScreen(element: google.maps.MapElement) {
    const fullScreenIcon = document.querySelector<HTMLElement>(
        '#fullscreen-button .material-icons'
    )!;

    try {
        if (!document.fullscreenElement) {
            element.requestFullscreen();
            fullScreenIcon.innerText = 'fullscreen_exit';
        } else {
            document.exitFullscreen();
            fullScreenIcon.innerText = 'fullscreen';
        }
    } catch (error) {
        console.error('Error toggling fullscreen:', error);
    }
}

initMap();
// [END maps_control_replacement]
