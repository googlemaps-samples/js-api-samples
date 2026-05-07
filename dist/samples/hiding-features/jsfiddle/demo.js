'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function init() {
    // Request needed libraries.
    await google.maps.importLibrary('maps');

    // Get the gmp-map element.
    const mapElement = document.querySelector('gmp-map');

    // Get the inner map.
    const innerMap = mapElement.innerMap;

    innerMap.setOptions({
        mapTypeControl: false,
        // A map's styles property can only be set on a raster map.
        renderingType: 'RASTER',
    });

    // Apply new JSON when the user chooses to hide/show features.
    document.getElementById('hide-poi').addEventListener('click', () => {
        innerMap.setOptions({ styles: styles['hide'] });
    });
    document.getElementById('show-poi').addEventListener('click', () => {
        innerMap.setOptions({ styles: styles['default'] });
    });
}

const styles = {
    default: [],
    hide: [
        {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'transit',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }],
        },
    ],
};

void init();
