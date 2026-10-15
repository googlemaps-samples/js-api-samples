/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_programmatic_load_button]
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const API_KEY = 'GOOGLE_MAPS_API_KEY';
const center = { lat: 41.90476224706472, lng: 12.49822074385094 };
const zoom = 14;
const url = 'https://maps.googleapis.com/maps/api/staticmap';

function init(): void {
    const wrapper = document.getElementById('wrapper') as HTMLButtonElement;

    wrapper.style.backgroundImage = `url(${url}?center=${String(center.lat)},${String(center.lng)}&zoom=${String(zoom)}&scale=2&size=${String(wrapper.clientWidth)}x${String(wrapper.clientHeight)}&key=${API_KEY})`;

    wrapper.addEventListener('click', () => {
        wrapper.remove();

        setOptions({
            key: API_KEY,
        });

        void importLibrary('maps').then(({ Map }) => {
            new Map(document.getElementById('map')!, {
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
export {};
// [END maps_programmatic_load_button]
