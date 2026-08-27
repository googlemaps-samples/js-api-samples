/**
 * @license
 * Copyright 2024 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable */
// @ts-nocheck

async function init() {
    await customElements.whenDefined('gmp-advanced-place-list');
    const listElement = document.querySelector('gmp-advanced-place-list');

    if (listElement) {
        listElement.addEventListener('gmp-error', (e) => {
            console.error('Failed to load places: ', e.detail.errors);
        });
    }
}

init();
