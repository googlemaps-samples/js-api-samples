'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

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

async function init() {
    // Request needed libraries.
    await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map');

    populateTable();

    // Get the inner map.
    const innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
    });

    for (const event of events) {
        setupListener(innerMap, event);
    }
}

// Dynamically create the table of events from the defined hashmap
function populateTable() {
    const eventsTable = document.getElementById('sidebar');

    for (const event of events) {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';
        eventDiv.id = event;
        eventDiv.innerText = event;
        eventsTable.appendChild(eventDiv);
    }
}

void init();
