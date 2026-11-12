/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const ASSET_BASE_URL = new URL(
  'https://maps-docs-team.web.app/samples/layer-data-quakes-red/dist/'
);

let innerMap;

async function init() {
  const [{ SymbolPath }] = await Promise.all([
    google.maps.importLibrary('core'),
    google.maps.importLibrary('maps'),
  ]);

  const mapElement = document.querySelector('gmp-map');

  innerMap = mapElement.innerMap;

  // Get the earthquake data (JSONP format)
  // This feed is a copy from the USGS feed, you can find the originals here:
  //   http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
  const script = document.createElement('script');

  script.setAttribute('src', new URL('./quakes.geo.js', ASSET_BASE_URL).href);

  document.getElementsByTagName('head')[0].appendChild(script);

  // Add a basic style.
  innerMap.data.setStyle((feature) => {
    const mag = Math.exp(parseFloat(feature.getProperty('mag'))) * 0.1;
    return {
      icon: {
        path: SymbolPath.CIRCLE,
        scale: mag,
        fillColor: '#f00',
        fillOpacity: 0.35,
        strokeWeight: 0,
      },
    };
  });
}

// Defines the callback function referenced in the jsonp file.

function earthquakeDataLoad(data) {
  innerMap.data.addGeoJson(data);
}

window.earthquakeDataLoad = earthquakeDataLoad;
void init();
export {};
