'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_geocoding_component_restriction]
async function initMap() {
    const [{ Geocoder }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('geocoding'),
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('maps'),
    ]);

    const geocoder = new Geocoder();
    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;

    document.getElementById('submit').addEventListener('click', async () => {
        const { results } = await geocoder.geocode({
            address: '483 George St.',
            componentRestrictions: {
                country: 'AU',
                postalCode: '2000',
            },
        });

        innerMap.setCenter(results[0].geometry.location);
        new AdvancedMarkerElement({
            map: innerMap,
            position: results[0].geometry.location,
        });
    });
}

void initMap();
// [END maps_geocoding_component_restriction]
