'use strict';
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const mapElement = document.querySelector('gmp-map');

async function initMap() {
    // Request needed libraries.
    const [, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
    ]);

    const marker = new AdvancedMarkerElement({
        position: { lat: 37.4239163, lng: -122.0947209 },
    });
    mapElement.append(marker);
}

void initMap();
