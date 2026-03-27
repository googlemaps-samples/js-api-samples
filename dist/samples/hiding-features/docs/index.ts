/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_hiding_features]
async function initMap() {
    // Request needed libraries.
    (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

    // Get the gmp-map element.
    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;

    // Get the inner map.
    const innerMap = mapElement.innerMap;

    innerMap.setOptions({
        mapTypeControl: false,
        // A map's styles property can only be set on a raster map.
        renderingType: google.maps.RenderingType.RASTER,
    });

    // Apply new JSON when the user chooses to hide/show features.
    (document.getElementById('hide-poi') as HTMLElement).addEventListener(
        'click',
        () => {
            innerMap.setOptions({ styles: styles['hide'] });
        }
    );
    (document.getElementById('show-poi') as HTMLElement).addEventListener(
        'click',
        () => {
            innerMap.setOptions({ styles: styles['default'] });
        }
    );
}

const styles: Record<string, google.maps.MapTypeStyle[]> = {
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

initMap();
// [END maps_hiding_features]
