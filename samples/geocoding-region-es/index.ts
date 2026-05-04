/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_js_geocoding_region_es]
async function initMap(): Promise<void> {
    await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('geocoding'),
        google.maps.importLibrary('marker'),
    ]);

    const mapElement = document.querySelector('gmp-map')!;
    const innerMap = mapElement.innerMap;
    const geocoder = new google.maps.Geocoder();

    geocoder
        .geocode({ address: 'Toledo' })
        .then((response) => {
            const position = response.results[0].geometry.location;

            innerMap.setCenter(position);
            new google.maps.marker.AdvancedMarkerElement({
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

initMap();
// [END maps_js_geocoding_region_es]
