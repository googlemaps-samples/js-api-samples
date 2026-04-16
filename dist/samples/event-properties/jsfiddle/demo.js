"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function initMap() {
    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps");
    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;
    const infowindow = new google.maps.InfoWindow({
        content: "Change the zoom level",
        position: mapElement.center,
    });
    infowindow.open(innerMap);
    innerMap.addListener("zoom_changed", () => {
        infowindow.setContent("Zoom: " + innerMap.getZoom());
    });
}
initMap();

