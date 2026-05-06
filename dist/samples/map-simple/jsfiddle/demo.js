'use strict';
/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function initMap() {
    // Import the needed libraries.
    await google.maps.importLibrary('maps');

    // Access the map.
    const mapElement = document.querySelector('gmp-map');
    // Access the underlying map object.
    const innerMap = mapElement.innerMap;

    console.log({ mapElement, innerMap });
}

void initMap();
