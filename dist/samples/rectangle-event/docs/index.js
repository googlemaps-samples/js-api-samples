'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_rectangle_event]
// This example adds a user-editable rectangle to the map.
// When the user changes the bounds of the rectangle,
// an info window pops up displaying the new bounds.

let rectangle;
let innerMap;

let infoWindow;

async function initMap() {
    const { Rectangle, InfoWindow } = await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map');
    innerMap = mapElement.innerMap;

    const bounds = {
        north: 44.599,
        south: 44.49,
        east: -78.443,
        west: -78.649,
    };

    // Define the rectangle and set its editable property to true.
    rectangle = new Rectangle({
        bounds: bounds,
        editable: true,
        draggable: true,
    });

    rectangle.setMap(innerMap);

    // Add an event listener on the rectangle.
    rectangle.addListener('bounds_changed', showNewRect);

    // Define an info window on the map.
    infoWindow = new InfoWindow();
}

/** Show the new coordinates for the rectangle in an info window. */
function showNewRect() {
    const ne = rectangle.getBounds().getNorthEast();
    const sw = rectangle.getBounds().getSouthWest();

    const contentString =
        '<b>Rectangle moved.</b><br>' +
        'New north-east corner: ' +
        ne.lat() +
        ', ' +
        ne.lng() +
        '<br>' +
        'New south-west corner: ' +
        sw.lat() +
        ', ' +
        sw.lng();

    // Set the info window's content and position.
    infoWindow.setContent(contentString);
    infoWindow.setPosition(ne);

    infoWindow.open(innerMap);
}

initMap();
// [END maps_rectangle_event]
