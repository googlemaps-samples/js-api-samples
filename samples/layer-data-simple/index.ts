/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_layer_data_simple]
async function init() {
    await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map')!;

    const innerMap = mapElement.innerMap;

    innerMap.data.loadGeoJson(
        new URL('./public/google.json', import.meta.url).href
    );
}

void init();
// [END maps_layer_data_simple]
