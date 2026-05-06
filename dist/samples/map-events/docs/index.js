'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_map_events]
const events = [
    'bounds_changed',
    'center_changed',
    'click',
    'contextmenu',
    'dblclick',
    'drag',
    'dragend',
    'dragstart',
    'heading_changed',
    'idle',
    'maptypeid_changed',
    'mousemove',
    'mouseout',
    'mouseover',
    'projection_changed',
    'resize',
    'rightclick', // use contextmenu
    'tilesloaded',
    'tilt_changed',
    'zoom_changed',
];

function setupListener(map, name) {
    const eventRow = document.getElementById(name);
    map.addListener(name, () => {
        eventRow.className = 'event active';
        setTimeout(() => {
            eventRow.className = 'event inactive';
        }, 1000);
    });
}

async function initMap() {
    // Request needed libraries.
    await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map');

    populateTable();

    // Get the inner map.
    const innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
    });

    for (let i = 0; i < events.length; i++) {
        setupListener(innerMap, events[i]);
    }
}

// Dynamically create the table of events from the defined hashmap
function populateTable() {
    const eventsTable = document.getElementById('sidebar');

    for (let i = 0; i < events.length; i++) {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';
        eventDiv.id = events[i];
        eventDiv.innerText = events[i];
        eventsTable.appendChild(eventDiv);
    }
}

void initMap();
// [END maps_map_events]
