/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const API_KEY = 'GOOGLE_MAPS_API_KEY';
const center = { lat: 41.90476224706472, lng: 12.49822074385094 };
const zoom = 14;
const url = 'https://maps.googleapis.com/maps/api/staticmap';

function init() {
    const wrapper = document.getElementById('wrapper');

    // The Maps Static API limits size to 640x640.
    // We cap the requested dimensions and explicitly set the CSS background-size
    // to match so that POI icons and text render at the exact same physical scale
    // as the interactive map, rather than being stretched by background-size: cover.
    const reqWidth = Math.min(640, wrapper.clientWidth || 640);
    const reqHeight = Math.min(640, wrapper.clientHeight || 640);
    const scale = window.devicePixelRatio >= 2 ? 2 : 1;

    wrapper.style.backgroundImage = `url(${url}?center=${String(center.lat)},${String(center.lng)}&zoom=${String(zoom)}&scale=${String(scale)}&size=${String(reqWidth)}x${String(reqHeight)}&key=${API_KEY})`;
    wrapper.style.backgroundSize = `${String(reqWidth)}px ${String(reqHeight)}px`;
    wrapper.style.backgroundRepeat = 'no-repeat';
    wrapper.style.backgroundPosition = 'center';

    wrapper.addEventListener('click', () => {
        wrapper.remove();

        setOptions({
            key: API_KEY,
        });

        void importLibrary('maps').then(({ Map }) => {
            new Map(document.getElementById('map'), {
                center,
                zoom,
                mapId: 'DEMO_MAP_ID',
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});
