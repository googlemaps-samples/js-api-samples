"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function initMap() {
    
    
    //  Request the needed libraries.
    const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
    ]);
    
    
    // Get the gmp-map element.
    const mapElement = document.querySelector('gmp-map');
    // Get the inner map.
    const innerMap = mapElement.innerMap;
    // Set map options.
    innerMap.setOptions({
        mapTypeControl: false,
    });
    
    
    
    // Add a marker positioned at the map center (Uluru).
    const marker = new AdvancedMarkerElement({
        map: innerMap,
        position: mapElement.center,
        title: 'Uluru/Ayers Rock',
    });
    
}
initMap();

