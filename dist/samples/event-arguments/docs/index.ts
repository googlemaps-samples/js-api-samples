/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_event_arguments]
async function init() {
    // Request needed libraries.
    const [{ AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('maps'),
    ]);

    const mapElement = document.querySelector('gmp-map')!;
    const innerMap = mapElement.innerMap;

    innerMap.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (!event.latLng) return;
        new AdvancedMarkerElement({
            position: event.latLng,
            map: innerMap,
        });
        innerMap.panTo(event.latLng);
    });
}

void init();
// [END maps_event_arguments]
