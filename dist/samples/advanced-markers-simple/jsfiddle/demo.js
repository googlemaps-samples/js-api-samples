"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */


const mapElement = document.querySelector('gmp-map');
async function initMap() {
    // Request needed libraries.
    await google.maps.importLibrary('maps');
    await google.maps.importLibrary('marker');
    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: 37.4239163, lng: -122.0947209 },
    });
    mapElement.append(marker);
}

initMap();

