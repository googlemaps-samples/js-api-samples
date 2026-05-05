'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_web_components_events]
// This example adds a map using web components.
async function initMap() {
    google.maps.importLibrary('marker'); // preload
    const { InfoWindow } = await google.maps.importLibrary('maps');

    console.log('Maps JavaScript API loaded.');

    const advancedMarkers = document.querySelectorAll(
        '#marker-click-event-example gmp-advanced-marker'
    );

    for (const advancedMarker of advancedMarkers) {
        customElements.whenDefined(advancedMarker.localName).then(async () => {
            advancedMarker.addEventListener('gmp-click', () => {
                const infoWindow = new InfoWindow({
                    content: advancedMarker.title,
                });

                infoWindow.open({
                    anchor: advancedMarker,
                });
            });
        });
    }
}

initMap();
// [END maps_web_components_events]
