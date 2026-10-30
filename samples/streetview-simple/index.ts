/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_streetview_simple]
async function init(): Promise<void> {
    // Request needed libraries.
    const [{ StreetViewPanorama }] = await Promise.all([
        google.maps.importLibrary('streetView'),
        google.maps.importLibrary('maps'),
    ]);

    // Get the gmp-map element and its innerMap.
    const mapElement = document.querySelector('gmp-map')!;
    const innerMap = mapElement.innerMap;

    // Get the center of the map.
    const position = mapElement.center as google.maps.LatLngLiteral;

    // Create a new StreetViewPanorama, set its position, and attach it to the map.
    const panorama = new StreetViewPanorama(document.getElementById('pano')!, {
        position,
        pov: {
            heading: 34,
            pitch: 10,
        },
    });

    /**
     * Set the StreetViewPanorama so it displays in the pano element
     * rather than taking over the map.
     * This creates a link between the map and the panorama so that
     * the map is updated when the StreetViewPanorama position changes,
     * and the StreetViewPanorama is updated when the map changes.
     */
    innerMap.setStreetView(panorama);
}

void init();
// [END maps_streetview_simple]
