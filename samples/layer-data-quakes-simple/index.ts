/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_layer_data_quakes_simple]
let innerMap: google.maps.Map;

async function init() {
    await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map')!;

    innerMap = mapElement.innerMap;

    // Get the earthquake data (JSONP format)
    // This feed is a copy from the USGS feed, you can find the originals here:
    //   http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
    const script = document.createElement('script');

    script.setAttribute('src', 'quakes.geo.js');

    document.getElementsByTagName('head')[0].appendChild(script);
}

// Defines the callback function referenced in the jsonp file.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function earthquakeDataLoad(data: any) {
    innerMap.data.addGeoJson(data);
}

window.earthquakeDataLoad = earthquakeDataLoad;
void init();
// [END maps_layer_data_quakes_simple]
