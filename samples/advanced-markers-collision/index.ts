/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_advanced_markers_collision]
declare namespace mdc {
    namespace select {
        class MDCSelect {
            constructor(el: Element | null);
            listen(evtType: string, handler: (event: Event) => void): void;
            value: string;
        }
    }
}

const mapElement = document.querySelector('gmp-map')!;

// Initialize and add the map
async function init(): Promise<void> {
    // Request needed libraries.
    const [{ AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('maps'),
    ]);

    const markers: google.maps.marker.AdvancedMarkerElement[] = [];

    const collisionBehavior: google.maps.CollisionBehaviorString = 'REQUIRED';

    const select = new mdc.select.MDCSelect(
        document.querySelector('.mdc-select')
    );

    select.listen('MDCSelect:change', () => {
        markers.forEach((marker) => {
            marker.collisionBehavior =
                select.value as google.maps.CollisionBehavior;
        });
    });

    select.value = collisionBehavior;

    // Create some markers on the map
    const locations = [
        [-122.3402, 47.6093],
        [-122.3402, 47.6094],
        [-122.3403, 47.6094],
        [-122.3384, 47.6098],
        [-122.3389, 47.6095],
        [-122.3396, 47.6095],
        [-122.3379, 47.6097],
        [-122.3378, 47.6097],
        [-122.3396, 47.6091],
        [-122.3383, 47.6089],
        [-122.3379, 47.6093],
        [-122.3381, 47.6095],
        [-122.3378, 47.6095],
    ];

    locations.forEach(([lng, lat]: number[]) => {
        // [START maps_advanced_markers_collision_create_marker]
        const advancedMarker = new AdvancedMarkerElement({
            position: { lat, lng },
            collisionBehavior,
        });
        mapElement.appendChild(advancedMarker);
        // [END maps_advanced_markers_collision_create_marker]
        markers.push(advancedMarker);
    });
}

void init();
// [END maps_advanced_markers_collision]
