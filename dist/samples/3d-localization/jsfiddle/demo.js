"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
//@ts-nocheck

async function initMap() {
    const { Map3DElement } = await google.maps.importLibrary('maps3d');
    const map = new Map3DElement({
        center: {
            lat: 49.75371685807847,
            lng: -123.13227141171181,
            altitude: 30,
        },
        tilt: 50.64793990040634,
        heading: 44.480020261589154,
        range: 51618.36056532338,
        language: 'ZH',
        region: 'CN',
        mode: 'HYBRID',
        gestureHandling: 'COOPERATIVE',
    });
    document.body.append(map);
}
initMap();

