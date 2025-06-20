"use strict";
/*
* @license
* Copyright 2025 Google LLC. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
// @ts-nocheck

async function init() {
    // Import the needed libraries.
    const { Map3DElement, Model3DInteractiveElement } = await google.maps.importLibrary("maps3d");
    const map = new Map3DElement({
        center: { lat: 39.1178, lng: -106.4452, altitude: 4395.4952 }, range: 1500, tilt: 74, heading: 0,
        mode: "HYBRID",
    });
    const model = new Model3DInteractiveElement({
        src: 'https://maps-docs-team.web.app/assets/windmill.glb',
        position: { lat: 39.1178, lng: -106.4452, altitude: 4495.4952 },
        orientation: { heading: 0, tilt: 270, roll: 90 },
        scale: .15,
        altitudeMode: "CLAMP_TO_GROUND",
    });
    model.addEventListener('gmp-click', (event) => {
        const clickedModel = event.target;
        clickedModel.scale = Math.random() * (0.5 - 0.1) + 0.1;
    });
    document.body.append(map);
    map.append(model);
}
init();

