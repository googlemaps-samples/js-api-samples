'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_circle_simple]
const mapElement = document.querySelector('gmp-map');
let innerMap;

async function init() {
    // Request needed libraries.
    const [{ Circle }, { AdvancedMarkerElement }, { event }] =
        await Promise.all([
            google.maps.importLibrary('maps'),
            google.maps.importLibrary('marker'),
            google.maps.importLibrary('core'),
        ]);

    // Set the initial map center point.
    const initialCenter = { lat: 34.98956821576194, lng: 135.74239981260283 }; // Hotel Emion, Kyoto, Japan

    // Get the inner map.
    innerMap = mapElement.innerMap;

    // Get the buttons.
    const buttons = document.querySelectorAll('input[name="radius"]');

    // Create the circle.
    const walkingCircle = new Circle({
        strokeColor: '#ffdd00ff',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#ffdd00ff',
        fillOpacity: 0.35,
        map: innerMap,
        center: initialCenter,
        radius: 400,
        draggable: true,
        editable: false,
    });

    // Define a "Crosshair" vector icon
    const parser = new DOMParser();
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-6 -6 12 12"><path d="M -6,0 L 6,0 M 0,-6 L 0,6" stroke="black" stroke-width="1"/></svg>`;

    const pinSvg = parser.parseFromString(
        svgString,
        'image/svg+xml'
    ).documentElement;

    const centerMarker = new AdvancedMarkerElement({
        position: initialCenter,
        title: 'A marker using a custom SVG image.',
        anchorLeft: '-50%',
        anchorTop: '-50%',
    });
    centerMarker.append(pinSvg);
    mapElement.append(centerMarker);

    // Wait for the map to finish drawing its tiles.
    event.addListenerOnce(innerMap, 'tilesloaded', function () {
        // Get the controls div
        const controls = document.getElementById('control-panel');

        // Display controls once map is loaded.
        if (controls) {
            controls.style.display = 'block';
        }
    });

    // Add event listener to update the radius based on user selection.
    buttons.forEach((button) => {
        button.addEventListener('change', (changeEvent) => {
            const target = changeEvent.target;
            walkingCircle.setRadius(Number(target.value));
        });
    });

    // Handle user click, reset the map center and position the circle.
    innerMap.addListener('click', (mapsMouseEvent) => {
        const newCenter = mapsMouseEvent.latLng;
        walkingCircle.setCenter(newCenter);
        centerMarker.position = newCenter;
        innerMap.panTo(newCenter);
    });

    // Handle user dragging the circle, update the center marker position.
    walkingCircle.addListener('center_changed', () => {
        centerMarker.position = walkingCircle.getCenter();
    });
}

void init();
// [END maps_circle_simple]
