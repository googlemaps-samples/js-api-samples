/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_control_bounds_restriction]
let innerMap;
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;

// [START maps_control_bounds_restriction_region]
const NEW_ZEALAND_BOUNDS = {
    north: -34.36,
    south: -47.35,
    west: 166.28,
    east: -175.81,
};
// [END maps_control_bounds_restriction_region]

async function initMap() {
    // Import the needed libraries.
    (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

    innerMap = mapElement.innerMap;
    // [START maps_control_bounds_restriction_options]
    // Restrict the map to the provided bounds.
    innerMap.setOptions({
      restriction: {
        latLngBounds: NEW_ZEALAND_BOUNDS,
        strictBounds: false,
      }
    });
    // [END maps_control_bounds_restriction_options]
}

initMap();
// [END maps_control_bounds_restriction]
