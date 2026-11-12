/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_layer_data_simple]
const ASSET_BASE_URL = new URL('https://maps-docs-team.web.app/samples/layer-data-simple/dist/');

async function init() {
    await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map')!;

    const innerMap = mapElement.innerMap;

    innerMap.data.loadGeoJson(new URL('./google.json', ASSET_BASE_URL).href);
}

void init();
// [END maps_layer_data_simple]
