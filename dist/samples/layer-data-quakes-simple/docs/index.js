/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_layer_data_quakes_simple]
const ASSET_BASE_URL = new URL('https://maps-docs-team.web.app/samples/layer-data-quakes-simple/dist/');

let innerMap;

async function init() {
    await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map');

    innerMap = mapElement.innerMap;

    // Get the earthquake data (JSONP format)
    // This feed is a copy from the USGS feed, you can find the originals here:
    //   http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
    const script = document.createElement('script');

    script.setAttribute('src', new URL('./quakes.geo.js', ASSET_BASE_URL).href);

    document.getElementsByTagName('head')[0].appendChild(script);
}

// Defines the callback function referenced in the jsonp file.

function earthquakeDataLoad(data) {
    innerMap.data.addGeoJson(data);
}

window.earthquakeDataLoad = earthquakeDataLoad;
void init();
export {};
// [END maps_layer_data_quakes_simple]
