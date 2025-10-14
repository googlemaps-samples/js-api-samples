/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_advanced_markers_draggable]
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;

 async function initMap() {
    // Request needed libraries.
    const { Map, InfoWindow } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    const infoWindow = new InfoWindow();

    // [START maps_advanced_markers_draggable_marker]
    const draggableMarker = new AdvancedMarkerElement({
        position: {lat: 37.39094933041195, lng: -122.02503913145092},
        gmpDraggable: true,
        title: "This marker is draggable.",
    });
    mapElement.append(draggableMarker);
    // [END maps_advanced_markers_draggable_marker]
    
    draggableMarker.addListener('dragend', (event) => {
        const position = draggableMarker.position as google.maps.LatLng;
        infoWindow.close();
        infoWindow.setContent(`Pin dropped at: ${position.lat}, ${position.lng}`);
        infoWindow.open(draggableMarker.map, draggableMarker);
    });
}

initMap();
// [END maps_advanced_markers_draggable]
