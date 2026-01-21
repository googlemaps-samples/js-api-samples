/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_control_positioning_labels]
/**
 * Creates a series of custom controls to demonstrate positioning
 * of controls within a map.
 */

/**
 * MakeControl adds a control to the map.
 * This constructor takes the controlDIV name and label text as arguments.
 */
async function MakeControl(controlDiv: HTMLElement, label: string) {
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

    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;

    const innerMap = mapElement.innerMap;

    const controlText: [string, google.maps.ControlPosition][] = [
        [
            'BLOCK_START_INLINE_START',
            google.maps.ControlPosition.BLOCK_START_INLINE_START,
        ],
        [
            'INLINE_START_BLOCK_START',
            google.maps.ControlPosition.INLINE_START_BLOCK_START,
        ],
        [
            'BLOCK_START_INLINE_CENTER',
            google.maps.ControlPosition.BLOCK_START_INLINE_CENTER,
        ],
        [
            'BLOCK_START_INLINE_END',
            google.maps.ControlPosition.BLOCK_START_INLINE_END,
        ],
        [
            'INLINE_END_BLOCK_START',
            google.maps.ControlPosition.INLINE_END_BLOCK_START,
        ],
        [
            'INLINE_START_BLOCK_CENTER',
            google.maps.ControlPosition.INLINE_START_BLOCK_CENTER,
        ],
        [
            'INLINE_END_BLOCK_CENTER',
            google.maps.ControlPosition.INLINE_END_BLOCK_CENTER,
        ],
        [
            'BLOCK_END_INLINE_START',
            google.maps.ControlPosition.BLOCK_END_INLINE_START,
        ],
        [
            'INLINE_START_BLOCK_END',
            google.maps.ControlPosition.INLINE_START_BLOCK_END,
        ],
        [
            'BLOCK_END_INLINE_CENTER',
            google.maps.ControlPosition.BLOCK_END_INLINE_CENTER,
        ],
        [
            'BLOCK_END_INLINE_END',
            google.maps.ControlPosition.BLOCK_END_INLINE_END,
        ],
        [
            'INLINE_END_BLOCK_END',
            google.maps.ControlPosition.INLINE_END_BLOCK_END,
        ],
    ];

    for (let i = 0; i < controlText.length; i++) {
        const divLabel = controlText[i][0] as string;
        const divName = document.createElement('div');

        MakeControl(divName, divLabel);
        innerMap.controls[controlText[i][1]].push(divName);
        divName.addEventListener('click', toggleRTL);
    }
}

/**
 * Toggles the 'dir' attribute on the html element between 'ltr' and 'rtl'.
 */
async function toggleRTL() {
    const html = document.documentElement;
    if (html.dir === 'rtl') {
        html.dir = 'ltr';
    } else {
        html.dir = 'rtl';
    }
}

initMap();
// [END maps_control_positioning_labels]
