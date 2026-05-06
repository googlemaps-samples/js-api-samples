/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_map_events]
const mapElement = document.querySelector('gmp-map-3d')!;

async function init() {
    // Import the needed libraries.
    await google.maps.importLibrary('maps3d');

    const events = [...document.querySelectorAll('div > p')].map(
        (i) => i.textContent
    );
    for (const event of events) {
        mapElement?.addEventListener(event, () => {
            const eventElement = document.querySelector(`#${event}`);
            eventElement?.classList.add('active');
            setTimeout(() => {
                eventElement?.classList.remove('active');
            }, 1000);
        });
    }
}

init();
// [END maps_3d_map_events]
