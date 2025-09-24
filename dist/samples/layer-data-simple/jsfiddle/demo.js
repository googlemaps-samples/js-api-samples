"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function initMap() {
    (await google.maps.importLibrary("maps"));
    const mapElement = document.querySelector("gmp-map");
    let innerMap = mapElement.innerMap;
    google.maps.event.addListenerOnce(innerMap, "idle", () => {
        innerMap.data.loadGeoJson("google.json");
    });
}
initMap();

