"use strict";
/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// Initialize and add the map
let map;
async function initMap() {
    
    // The location of Uluru.
    const position = { lat: -25.344, lng: 131.031 };
    //  Request needed libraries.
    const { Map } = await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
    // The map, centered at Uluru
    map = new Map(document.getElementById('map'), {
        zoom: 4,
        center: position,
        mapId: 'DEMO_MAP_ID',
    });
    
    
    // The marker, positioned at Uluru
    const marker = new AdvancedMarkerElement({ map, position, title: 'Uluru' });
      
}
initMap();

