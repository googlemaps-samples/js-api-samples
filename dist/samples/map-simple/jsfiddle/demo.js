"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

let map;
async function initMap() {
    const { Map, RenderingType } = (await google.maps.importLibrary('maps'));
    map = new Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        renderingType: RenderingType.VECTOR,
    });
}
initMap();

