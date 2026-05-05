/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_accessibility_features]
async function initMap() {
    // Import the needed libraries.
    const [{ Marker3DInteractiveElement, PopoverElement }, { PinElement }] =
        await Promise.all([
            google.maps.importLibrary('maps3d'),
            google.maps.importLibrary('marker'),
        ]);

    const map3DElement = document.querySelector('gmp-map-3d')!;

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

    tourStops.forEach(({ position, title }, i) => {
        const pin = new PinElement({
            glyphText: `${i + 1}`,
            scale: 1.5,
            glyphColor: '#FFFFFF',
        });
        const popover = new PopoverElement();

        const content = `${i + 1}. ${title}`;
        const header = document.createElement('span');
        // Include the label for screen readers.
        header.ariaLabel = `This is marker ${i + 1}. ${title}`;
        header.slot = 'header';

        popover.append(header);
        popover.append(content);

        const interactiveMarker = new Marker3DInteractiveElement({
            // Include a title, used for accessibility text for use by screen readers.
            title,
            position,
            gmpPopoverTargetElement: popover,
        });

        interactiveMarker.append(pin);

        map3DElement.append(interactiveMarker);
        map3DElement.append(popover);
    });

    document.body.append(map3DElement);
}

initMap();
// [END maps_3d_accessibility_features]
