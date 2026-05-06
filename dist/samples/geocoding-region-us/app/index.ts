/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_js_geocoding_region_us]
async function initMap(): Promise<void> {
    const [{ Geocoder }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('geocoding'),
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('maps'),
    ]);

    const mapElement = document.querySelector('gmp-map')!;
    const innerMap = mapElement.innerMap;
    const geocoder = new Geocoder();

    geocoder
        .geocode({ address: 'Toledo' })
        .then((response) => {
            const position = response.results[0].geometry.location;

            innerMap.setCenter(position);
            new AdvancedMarkerElement({
                map: innerMap,
                position,
            });
        })
        .catch((e) =>
            window.alert(
                'Geocode was not successful for the following reason: ' + e
            )
        );
}

void initMap();
// [END maps_js_geocoding_region_us]
