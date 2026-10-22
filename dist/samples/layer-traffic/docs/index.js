'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_layer_traffic]
async function init() {
    const { TrafficLayer } = await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;

    const trafficLayer = new TrafficLayer();

    trafficLayer.setMap(innerMap);
}

void init();
// [END maps_layer_traffic]
