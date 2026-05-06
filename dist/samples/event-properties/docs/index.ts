/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_event_properties]
async function initMap() {
    // Request needed libraries.
    const { InfoWindow } = await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map')!;
    const innerMap = mapElement.innerMap;

    const infoWindow = new InfoWindow({
        content: 'Change the zoom level',
        position: mapElement.center,
    });

    infoWindow.open(innerMap);

    innerMap.addListener('zoom_changed', () => {
        infoWindow.setContent('Zoom: ' + innerMap.getZoom()!);
    });
}

void initMap();
// [END maps_event_properties]
