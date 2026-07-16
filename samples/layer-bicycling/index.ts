/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_layer_bicycling]
async function init(): Promise<void> {
    const { BicyclingLayer } = await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map')!;
    const innerMap = mapElement.innerMap;

    const bikeLayer = new BicyclingLayer();

    bikeLayer.setMap(innerMap);
}

void init();
// [END maps_layer_bicycling]
