"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Creates a series of custom controls to demonstrate positioning
 * of controls within a map.
 */
/**
 * MakeControl adds a control to the map.
 * This constructor takes the controlDIV name and label text as arguments.
 */
async function MakeControl(controlDiv, label) {
    // Set up the control border.
    const controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.padding = '3px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to toggle RTL/LTR';
    controlUI.className = 'controlUI';
    controlDiv.appendChild(controlUI);
    // Set up the inner control.
    const controlText = document.createElement('div');
    controlText.style.fontSize = '12px';
    controlText.innerHTML = label;
    controlText.className = 'controlText';
    controlUI.appendChild(controlText);
}
async function initMap() {
    //  Request the needed libraries.
    await google.maps.importLibrary('maps');
    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;
    const positions = [
        'BLOCK_START_INLINE_START',
        'INLINE_START_BLOCK_START',
        'BLOCK_START_INLINE_CENTER',
        'BLOCK_START_INLINE_END',
        'INLINE_END_BLOCK_START',
        'INLINE_START_BLOCK_CENTER',
        'INLINE_END_BLOCK_CENTER',
        'BLOCK_END_INLINE_START',
        'INLINE_START_BLOCK_END',
        'BLOCK_END_INLINE_CENTER',
        'BLOCK_END_INLINE_END',
        'INLINE_END_BLOCK_END',
    ];
    positions.forEach((position) => {
        const divName = document.createElement('div');
        const controlPosition = google.maps.ControlPosition[position];
        MakeControl(divName, position);
        divName.addEventListener('click', toggleRTL);
        innerMap.controls[controlPosition].push(divName);
    });
}
/**
 * Toggles the 'dir' attribute on the html element between 'ltr' and 'rtl'.
 */
async function toggleRTL() {
    const html = document.documentElement;
    if (html.dir === 'rtl') {
        html.dir = 'ltr';
    }
    else {
        html.dir = 'rtl';
    }
}
initMap();

