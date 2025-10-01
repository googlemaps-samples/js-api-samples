"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_layer_data_quakes_red]
let innerMap;
async function initMap() {
    (await google.maps.importLibrary("maps"));
    const mapElement = document.querySelector("gmp-map");
    innerMap = mapElement.innerMap;
    // Get the earthquake data (JSONP format)
    // This feed is a copy from the USGS feed, you can find the originals here:
    //   http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
    const script = document.createElement("script");
    script.setAttribute("src", "quakes.geo.json");
    document.getElementsByTagName("head")[0].appendChild(script);
    // Add a basic style.
    innerMap.data.setStyle((feature) => {
        const mag = Math.exp(parseFloat(feature.getProperty("mag"))) * 0.1;
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
function eqfeed_callback(data) {
    innerMap.data.addGeoJson(data);
}
window.eqfeed_callback = eqfeed_callback;
initMap();
// [END maps_layer_data_quakes_red]
