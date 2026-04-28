/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_layer_traffic]
async function initMap(): Promise<void> {
    await google.maps.importLibrary('maps');

    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;
    const innerMap = mapElement.innerMap;

    const trafficLayer = new google.maps.TrafficLayer();

    trafficLayer.setMap(innerMap);
}

initMap();
// [END maps_layer_traffic]
