'use strict';
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function init() {
    await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map');

    const innerMap = mapElement.innerMap;

    innerMap.data.loadGeoJson('google.json');
}

void init();
