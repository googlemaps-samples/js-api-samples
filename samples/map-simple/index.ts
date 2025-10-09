/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// TEST COMMENT 001
// [START maps_map_simple]
let map: google.maps.Map
async function initMap(): Promise<void> {
    const { Map } = (await google.maps.importLibrary(
        'maps'
    )) as google.maps.MapsLibrary
    map = new Map(document.getElementById('map') as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    })
}

initMap()
// [END maps_map_simple]
