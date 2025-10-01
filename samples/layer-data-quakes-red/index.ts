/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_layer_data_quakes_red]
let innerMap;
let earthquakeData;

async function initMap() {
  (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;

  const mapElement = document.querySelector(
    "gmp-map"
  ) as google.maps.MapElement;

  innerMap = mapElement.innerMap;

  if (earthquakeData) {
    innerMap.data.addGeoJson(earthquakeData);
  }

  // Add a basic style.
  innerMap.data.setStyle((feature) => {
    const mag = Math.exp(parseFloat(feature.getProperty("mag") as string)) * 0.1;
    return /** @type {google.maps.Data.StyleOptions} */ {
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: mag,
        fillColor: "#f00",
        fillOpacity: 0.35,
        strokeWeight: 0,
      },
    };
  });
}

// Defines the callback function referenced in the jsonp file.
window.eqfeed_callback = function (data: any) {
  if (innerMap) {
    innerMap.data.addGeoJson(data);
  } else {
    earthquakeData = data;
  }
};

initMap();

declare global {
  interface Window {
    eqfeed_callback: (results: any) => void;
  }
}

export {};
// [END maps_layer_data_quakes_red]
