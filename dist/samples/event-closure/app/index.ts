/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_event_closure]
async function init() {
    // Request needed libraries.
    const [{ AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('maps'),
    ]);

    const mapElement = document.querySelector('gmp-map')!;
    const innerMap = mapElement.innerMap;

    const bounds: google.maps.LatLngBoundsLiteral = {
        north: -25.363882,
        south: -31.203405,
        east: 131.044922,
        west: 125.244141,
    };

    // Display the area between the location southWest and northEast.
    innerMap.fitBounds(bounds);

    // Add 5 markers to map at random locations.
    // For each of these markers, give them a title with their index, and when
    // they are clicked they should open an infoWindow with text from a secret
    // message.
    const secretMessages = ['This', 'is', 'the', 'secret', 'message'];
    const lngSpan = bounds.east - bounds.west;
    const latSpan = bounds.north - bounds.south;

    for (let i = 0; i < secretMessages.length; ++i) {
        const marker = new AdvancedMarkerElement({
            position: {
                lat: bounds.south + latSpan * Math.random(),
                lng: bounds.west + lngSpan * Math.random(),
            },
            map: innerMap,
        });

        void attachSecretMessage(marker, secretMessages[i]);
    }
}

// Attaches an info window to a marker with the provided message. When the
// marker is clicked, the info window will open with the secret message.
async function attachSecretMessage(
    marker: google.maps.marker.AdvancedMarkerElement,
    secretMessage: string
) {
    const { InfoWindow } = await google.maps.importLibrary('maps');

    const infoWindow = new InfoWindow({
        content: secretMessage,
    });

    marker.addListener('gmp-click', () => {
        infoWindow.open(marker.map, marker);
    });
}

void init();
// [END maps_event_closure]
