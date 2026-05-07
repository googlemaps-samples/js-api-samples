'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * This example creates an interactive map which constructs a polyline based on
 * user clicks. Note that the polyline only appears once its path property
 * contains two LatLng coordinates.
 */

let poly;
const mapElement = document.querySelector('gmp-map');
let innerMap;

async function init() {
    // Import the needed libraries.
    const [{ Polyline }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
    ]);

    innerMap = mapElement.innerMap;

    poly = new Polyline({
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
    });
    poly.setMap(innerMap);

    // Handles click events on a map, and adds a new point to the Polyline.
    innerMap.addListener('click', (event) => {
        const latLng = event.latLng;
        if (!latLng) return;

        const path = poly.getPath();

        // Because path is an MVCArray, we can simply append a new coordinate
        // and it will automatically appear.
        path.push(latLng);

        // Add a new marker at the new plotted point on the polyline.
        new AdvancedMarkerElement({
            position: latLng,
            title: '#' + path.getLength(),
            map: innerMap,
        });
    });
}

void init();
