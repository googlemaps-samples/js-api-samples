'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function init() {
    await google.maps.importLibrary('places');
    await customElements.whenDefined('gmp-advanced-place-list');
    const listElement = document.querySelector('gmp-advanced-place-list');

    if (listElement) {
        listElement.addEventListener('gmp-error', (e) => {
            const customEvent = e;
            console.error(
                'Failed to load places: ',
                customEvent.detail.errors ?? customEvent
            );
        });
    }
}

void init();
