/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_geocoding_place_id]
// Initialize the map.
async function initMap(): Promise<void> {
    await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('geocoding'),
        google.maps.importLibrary('marker'),
    ]);

    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;
    const innerMap = mapElement.innerMap;
    const geocoder = new google.maps.Geocoder();
    const infowindow = new google.maps.InfoWindow();

    (document.getElementById('submit') as HTMLElement).addEventListener(
        'click',
        () => {
            geocodePlaceId(geocoder, innerMap, infowindow);
        }
    );
}

// This function is called when the user clicks the UI button.
function geocodePlaceId(
    geocoder: google.maps.Geocoder,
    map: google.maps.Map,
    infowindow: google.maps.InfoWindow
) {
    const placeId = (document.getElementById('place-id') as HTMLInputElement)
        .value;

    geocoder
        .geocode({ placeId: placeId })
        .then(({ results }) => {
            if (results[0]) {
                map.setZoom(11);
                map.setCenter(results[0].geometry.location);

                const marker = new google.maps.marker.AdvancedMarkerElement({
                    map,
                    position: results[0].geometry.location,
                });

                infowindow.setContent(results[0].formatted_address);
                infowindow.open(map, marker);
            } else {
                window.alert('No results found');
            }
        })
        .catch((e) => window.alert('Geocoder failed due to: ' + e));
}

initMap();
// [END maps_geocoding_place_id]
