/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_map_event]
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

function setupListener(map: google.maps.Map, name: string) {
    const eventRow = document.getElementById(name) as HTMLElement;
    google.maps.event.addListener(map, name, () => {
        eventRow.className = 'event active';
        const timeout = setTimeout(() => {
            eventRow.className = 'event inactive';
        }, 1000);
    });
}

async function initMap() {
    // Request needed libraries.
    (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;

    populateTable();

    // Get the inner map.
    let innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
    });
    
    for (let i = 0; i < events.length; i++) {
        setupListener(innerMap, events[i]);
    }
}

// Dynamically create the table of events from the defined hashmap
function populateTable() {
    const eventsTable = document.getElementById('sidebar') as HTMLElement;

    for (let i = 0; i < events.length; i++) {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';
        eventDiv.id = events[i];
        eventDiv.innerText = events[i];
        eventsTable.appendChild(eventDiv);
    }
}

initMap();
// [END maps_map_event]
