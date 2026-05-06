'use strict';
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_advanced_markers_draggable]
const mapElement = document.querySelector('gmp-map');

async function initMap() {
    // Request needed libraries.
    const [{ InfoWindow }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
    ]);

    const infoWindow = new InfoWindow();

    // [START maps_advanced_markers_draggable_marker]
    const draggableMarker = new AdvancedMarkerElement({
        position: { lat: 37.39094933041195, lng: -122.02503913145092 },
        gmpDraggable: true,
        title: 'This marker is draggable.',
    });
    mapElement.append(draggableMarker);
    // [END maps_advanced_markers_draggable_marker]

    draggableMarker.addListener('dragend', () => {
        const position = draggableMarker.position;
        infoWindow.close();
        infoWindow.setContent(`Pin dropped at: ${JSON.stringify(position)}`);
        infoWindow.open(draggableMarker.map, draggableMarker);
    });
}

void initMap();
// [END maps_advanced_markers_draggable]
