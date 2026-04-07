"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const mapElement = document.querySelector('gmp-map');
async function initMap() {
    // Request needed libraries.
    const { Map, InfoWindow } = (await google.maps.importLibrary('maps'));
    const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker'));
    const infoWindow = new InfoWindow();
    
    const draggableMarker = new AdvancedMarkerElement({
        position: { lat: 37.39094933041195, lng: -122.02503913145092 },
        gmpDraggable: true,
        title: 'This marker is draggable.',
    });
    mapElement.append(draggableMarker);
    
    draggableMarker.addListener('dragend', (event) => {
        const position = draggableMarker.position;
        infoWindow.close();
        infoWindow.setContent(`Pin dropped at: ${position.lat}, ${position.lng}`);
        infoWindow.open(draggableMarker.map, draggableMarker);
    });
}
initMap();

