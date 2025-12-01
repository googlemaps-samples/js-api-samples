"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const mapElement = document.querySelector('gmp-map');
async function initMap() {
    // Request needed libraries.
    const { Map, InfoWindow } = (await google.maps.importLibrary('maps'));
    const { AdvancedMarkerElement, PinElement } = (await google.maps.importLibrary('marker'));
    // Set LatLng and title text for the markers. The first marker (Boynton Pass)
    // receives the initial focus when tab is pressed. Use arrow keys to move
    // between markers; press tab again to cycle through the map controls.
    const tourStops = [
        {
            position: { lat: 34.8791806, lng: -111.8265049 },
            title: 'Boynton Pass',
        },
        {
            position: { lat: 34.8559195, lng: -111.7988186 },
            title: 'Airport Mesa',
        },
        {
            position: { lat: 34.832149, lng: -111.7695277 },
            title: 'Chapel of the Holy Cross',
        },
        {
            position: { lat: 34.823736, lng: -111.8001857 },
            title: 'Red Rock Crossing',
        },
        {
            position: { lat: 34.800326, lng: -111.7665047 },
            title: 'Bell Rock',
        },
    ];
    // Create an info window to share between markers.
    const infoWindow = new InfoWindow();
    // Create the markers.
    tourStops.forEach(({ position, title }, i) => {
        
        const pin = new PinElement({
            //@ts-ignore
            glyphText: `${i + 1}`,
            scale: 1.5,
        });
        const marker = new AdvancedMarkerElement({
            position,
            title: `${i + 1}. ${title}`,
            gmpClickable: true,
        });
        marker.append(pin);
        mapElement.append(marker);
        
        
        // Add a click listener for each marker, and set up the info window.
        marker.addListener('click', ({ domEvent, latLng }) => {
            const { target } = domEvent;
            infoWindow.close();
            infoWindow.setContent(marker.title);
            infoWindow.open(marker.map, marker);
        });
        
    });
}
initMap();

