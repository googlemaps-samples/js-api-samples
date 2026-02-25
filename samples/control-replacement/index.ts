/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// GLOBAL TYPE EXTENSIONS
// These allow TypeScript to recognize vendor-prefixed fullscreen methods.
declare global {
    interface Document {
        mozCancelFullScreen?: () => Promise<void>;
        msExitFullscreen?: () => Promise<void>;
        webkitExitFullscreen?: () => Promise<void>;
        mozFullScreenElement?: Element;
        msFullscreenElement?: Element;
        webkitFullscreenElement?: Element;
        onwebkitfullscreenchange?: any;
        onmsfullscreenchange?: any;
        onmozfullscreenchange?: any;
    }

    interface HTMLElement {
        msRequestFullScreen?: () => Promise<void>;
        mozRequestFullScreen?: () => Promise<void>;
        webkitRequestFullScreen?: () => Promise<void>;
    }
}

// [START maps_control_replacement]
let innerMap: google.maps.Map;

async function initMap() {
    // Load the needed libraries.
    await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;

    innerMap = mapElement.innerMap;

    // Disable the default controls.
    innerMap.setOptions({
        disableDefaultUI: true,
    });

    google.maps.event.addListenerOnce(innerMap, 'tilesloaded', () => {
        initZoomControl(innerMap);
        initMapTypeControl(innerMap);
        initFullscreenControl(innerMap);
    });
}

function initZoomControl(map: google.maps.Map) {
    const zoomInButton = document.querySelector(
        '.zoom-control-in'
    ) as HTMLButtonElement;
    const zoomOutButton = document.querySelector(
        '.zoom-control-out'
    ) as HTMLButtonElement;

    zoomInButton?.addEventListener('click', () => {
        map.setZoom((map.getZoom() || 0) + 1);
    });

    zoomOutButton?.addEventListener('click', () => {
        map.setZoom((map.getZoom() || 0) - 1);
    });
}

async function initMapTypeControl(innerMap: google.maps.Map) {
    const mapTypeControlDiv = document.querySelector(
        '.maptype-control'
    ) as HTMLElement;
    const btnMap = document.querySelector(
        '.maptype-control-map'
    ) as HTMLButtonElement;
    const btnSatellite = document.querySelector(
        '.maptype-control-satellite'
    ) as HTMLButtonElement;

    btnMap?.addEventListener('click', () => {
        mapTypeControlDiv.classList.add('maptype-control-is-map');
        mapTypeControlDiv.classList.remove('maptype-control-is-satellite');
        innerMap.setMapTypeId('roadmap');
    });

    btnSatellite?.addEventListener('click', () => {
        mapTypeControlDiv.classList.add('maptype-control-is-satellite');
        mapTypeControlDiv.classList.remove('maptype-control-is-map');
        innerMap.setMapTypeId('hybrid');
    });
}

async function initFullscreenControl(innerMap: google.maps.Map) {
    // Get the gmp-map element to send fullscreen requests to.
    const elementToSendFullscreen = document.querySelector('gmp-map') as google.maps.MapElement;
    const btnFullscreen = document.querySelector(
        '#fullscreen-button'
    ) as HTMLButtonElement;
    const fullscreenControl = document.querySelector(
        '.fullscreen-control'
    ) as HTMLElement;

    btnFullscreen?.addEventListener('click', async () => {
        if (isFullscreen(elementToSendFullscreen)) {
            exitFullscreen();
        } else {
            requestFullscreen(elementToSendFullscreen);
        }
    });

    // Handle UI updates when fullscreen state changes (ESC key or button)
    const handleFullscreenChange = () => {
        if (isFullscreen(elementToSendFullscreen)) {
            fullscreenControl.classList.add('is-fullscreen');
        } else {
            fullscreenControl.classList.remove('is-fullscreen');
        }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
}

// HELPER FUNCTIONS
function isFullscreen(element: google.maps.MapElement): boolean {
    const fsElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
    return fsElement === element;
}

function requestFullscreen(element: HTMLElement) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullScreen) {
        element.msRequestFullScreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

initMap();

export {}; // Ensures this file is treated as a module
// [END maps_control_replacement]
