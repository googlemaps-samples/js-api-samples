'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_streetview_custom_simple]
async function init() {
    // Request needed libraries.
    const [{ StreetViewPanorama }, { Size }] = await Promise.all([
        google.maps.importLibrary('streetView'),
        google.maps.importLibrary('core'),
    ]);

    // Construct the appropriate StreetViewPanoramaData given
    // the passed pano IDs.
    function getCustomPanorama(pano) {
        if (pano === 'reception') {
            return {
                location: {
                    pano: 'reception',
                    description: 'Google Sydney - Reception',
                },
                links: [],
                // The text for the copyright control.
                copyright: 'Imagery (c) 2010 Google',
                // The definition of the tiles for this panorama.
                tiles: {
                    tileSize: new Size(1024, 512),
                    worldSize: new Size(2048, 1024),
                    // The heading in degrees at the origin of the panorama
                    // tile set.
                    centerHeading: 105,
                    getTileUrl: getCustomPanoramaTileUrl,
                },
            };
        }
        return null;
    }

    // Set up Street View and initially set it visible. Register the
    // custom panorama provider function. Set the StreetView to display
    // the custom panorama 'reception' which we check for below.
    const panorama = new StreetViewPanorama(document.getElementById('map'), {
        pano: 'reception',
        visible: true,
    });

    panorama.registerPanoProvider(getCustomPanorama);
}

// Return a pano image given the panoID.
function getCustomPanoramaTileUrl(pano, zoom, tileX, tileY) {
    return `https://developers.google.com/maps/documentation/javascript/examples/full/images/panoReception1024-${String(zoom)}-${String(tileX)}-${String(tileY)}.jpg`;
}

void init();
// [END maps_streetview_custom_simple]
