'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function init() {
    const { BicyclingLayer } = await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;

    const bikeLayer = new BicyclingLayer();

    bikeLayer.setMap(innerMap);
}

void init();
