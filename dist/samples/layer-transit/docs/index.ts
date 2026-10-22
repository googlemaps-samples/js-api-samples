/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_layer_transit]
async function init(): Promise<void> {
    const { TransitLayer } = await google.maps.importLibrary('maps');

    const mapElement =
        document.querySelector<google.maps.MapElement>('gmp-map')!;
    const innerMap = mapElement.innerMap;

    const transitLayer = new TransitLayer();

    transitLayer.setMap(innerMap);
}

void init();
// [END maps_layer_transit]
