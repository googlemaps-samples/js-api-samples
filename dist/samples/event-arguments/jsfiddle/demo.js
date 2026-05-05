'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function initMap() {
    // Request needed libraries.
    await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;

    innerMap.addListener('click', (e) => {
        new AdvancedMarkerElement({
            position: e.latLng,
            map: innerMap,
        });
        innerMap.panTo(e.latLng);
    });
}

initMap();
