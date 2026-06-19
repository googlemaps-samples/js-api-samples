/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_layer_bicycling]
async function initMap(): Promise<void> {
    await google.maps.importLibrary('maps');

    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;
    const innerMap = mapElement.innerMap;

    const bikeLayer = new google.maps.BicyclingLayer();

    bikeLayer.setMap(innerMap);
}

initMap();
// [END maps_layer_bicycling]
