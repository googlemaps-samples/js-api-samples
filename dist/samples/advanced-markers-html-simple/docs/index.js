"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_advanced_markers_html_simple]
// [START maps_advanced_markers_html_simple_snippet]
const mapElement = document.querySelector("gmp-map");
async function initMap() {
    // Request needed libraries.
    const { Map } = (await google.maps.importLibrary("maps"));
    const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker"));
    const priceTag = document.createElement("div");
    priceTag.className = "price-tag";
    priceTag.textContent = "$2.5M";
    const marker = new AdvancedMarkerElement({
        position: { lat: 37.42, lng: -122.1 },
    });
    marker.append(priceTag);
    mapElement.append(marker);
}
// [END maps_advanced_markers_html_simple_snippet]
initMap();
// [END maps_advanced_markers_html_simple]
