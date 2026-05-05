/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_advanced_markers_simple]
// [START maps_advanced_markers_simple_snippet]
const mapElement = document.querySelector('gmp-map')!;

async function initMap() {
    // Request needed libraries.
    const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
    ]);

    const marker = new AdvancedMarkerElement({
        position: { lat: 37.4239163, lng: -122.0947209 },
    });
    mapElement.append(marker);
}
// [END maps_advanced_markers_simple_snippet]
initMap();
// [END maps_advanced_markers_simple]
