"use strict";
/*
* @license
* Copyright 2025 Google LLC. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
// @ts-nocheck
// [START maps_3d_accessibility_features]
async function initMap() {
    const { Map3DElement, Marker3DInteractiveElement, PopoverElement } = await google.maps.importLibrary("maps3d");
    const { PinElement } = await google.maps.importLibrary("marker");
    const map = new Map3DElement({
        center: { lat: 34.8405, lng: -111.7909, altitude: 1322.70 }, range: 13279.50, tilt: 67.44, heading: 0.01,
        mode: 'SATELLITE'
    });
    // Set LatLng and title text for the markers. The first marker (Boynton Pass)
    // receives the initial focus when tab is pressed. Use arrow keys to move
    // between markers; press tab again to cycle through the map controls.
    const tourStops = [
        {
            position: { lat: 34.8791806, lng: -111.8265049 },
            title: "Boynton Pass",
        },
        {
            position: { lat: 34.8559195, lng: -111.7988186 },
            title: "Airport Mesa",
        },
        {
            position: { lat: 34.832149, lng: -111.7695277 },
            title: "Chapel of the Holy Cross",
        },
        {
            position: { lat: 34.823736, lng: -111.8001857 },
            title: "Red Rock Crossing",
        },
        {
            position: { lat: 34.800326, lng: -111.7665047 },
            title: "Bell Rock",
        },
    ];
    tourStops.forEach(({ position, title }, i) => {
        const pin = new PinElement({
            glyph: `${i + 1}`,
            scale: 1.5,
            glyphColor: "#FFFFFF"
        });
        const popover = new PopoverElement({
            open: true,
        });
        const content = `${i + 1}. ${title}`;
        const header = document.createElement('span');
        // Include the label for screen readers.
        header.ariaLabel = `This is marker ${i + 1}. ${title}`;
        header.slot = 'header';
        popover.append(header);
        popover.append(content);
        const interactiveMarker = new Marker3DInteractiveElement({
            position,
            gmpPopoverTargetElement: popover
        });
        interactiveMarker.append(pin);
        map.append(interactiveMarker);
        map.append(popover);
    });
    document.body.append(map);
}
initMap();
// [END maps_3d_accessibility_features]
