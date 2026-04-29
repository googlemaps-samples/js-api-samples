"use strict";
/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/*
 * Note: This sample demonstrates the standard JavaScript pattern for creating a map.
 * While this approach remains fully supported and is preferred by some developers,
 * we recommend considering the declarative <gmp-map> web component for new projects
 * and modern integrations.
 */

let map;
async function initMap() {
    // Import the needed libraries
    const { Map, RenderingType } = (await google.maps.importLibrary('maps'));
    // Create a new map from the div with id="map".
    map = new Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        renderingType: "VECTOR",
    });
}
initMap();

