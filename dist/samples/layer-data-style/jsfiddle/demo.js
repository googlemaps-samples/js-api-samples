'use strict';
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function init() {
    const [{ event }] = await Promise.all([
        google.maps.importLibrary('core'),
        google.maps.importLibrary('maps'),
    ]);

    const mapElement = document.querySelector('gmp-map');

    const innerMap = mapElement.innerMap;

    // Load GeoJSON.
    event.addListenerOnce(innerMap, 'idle', () => {
        innerMap.data.loadGeoJson('google.json');
    });

    // Set the stroke width, and fill color for each polygon
    innerMap.data.setStyle({
        fillColor: 'green',
        strokeWeight: 1,
    });
}

void init();
