/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_map_globe]
async function init() {
    const { Map3DElement } = await google.maps.importLibrary('maps3d');

    const map = new Map3DElement({
        center: {
            lat: 0,
            lng: 135,
            altitude: 0,
        },
        range: 20000000,
        tilt: 0,
        heading: 0,
        mode: 'ROADMAP',
    });

    document.body.append(map);

    const sydneyCamera = {
        center: {
            lat: -33.8568,
            lng: 151.2153,
            altitude: 0,
        },
        range: 1000,
        tilt: 65,
        heading: 0,
    };

    const flyButton = document.getElementById(
        'fly-button'
    ) as HTMLButtonElement;
    flyButton.addEventListener('click', () => {
        map.flyCameraTo({
            endCamera: sydneyCamera,
            durationMillis: 5000,
        });

        map.addEventListener(
            'gmp-animationend',
            () => {
                map.flyCameraAround({
                    camera: sydneyCamera,
                    durationMillis: 15000,
                    repeatCount: 1,
                });
            },
            { once: true }
        );
    });
}

void init();
// [END maps_3d_map_globe]
