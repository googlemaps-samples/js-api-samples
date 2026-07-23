'use strict';
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function init() {
    const { Map3DElement, PopoverElement } =
        await google.maps.importLibrary('maps3d');

    const map = new Map3DElement({
        center: { lat: 37.8204, lng: -122.4783, altitude: 0.407 },
        range: 4000,
        tilt: 74,
        heading: 38,
        mode: 'HYBRID',
    });

    const popover = new PopoverElement({
        altitudeMode: 'ABSOLUTE',
        open: true,
        positionAnchor: { lat: 37.819852, lng: -122.478549, altitude: 150 },
    });

    popover.append('Golden Gate Bridge');

    map.append(popover);

    document.body.append(map);
}

void init();
