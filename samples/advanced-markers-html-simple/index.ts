/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_advanced_markers_html_simple]
// [START maps_advanced_markers_html_simple_snippet]
const mapElement = document.querySelector('gmp-map')!;

async function initMap() {
    // Request needed libraries.
    const [, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
    ]);

    const priceTag = document.createElement('div');
    priceTag.className = 'price-tag';
    priceTag.textContent = '$2.5M';

    const marker = new AdvancedMarkerElement({
        position: { lat: 37.42, lng: -122.1 },
    });
    marker.append(priceTag);
    mapElement.append(marker);
}
// [END maps_advanced_markers_html_simple_snippet]
void initMap();
// [END maps_advanced_markers_html_simple]
