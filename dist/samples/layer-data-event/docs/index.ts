/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_layer_data_event]
const ASSET_BASE_URL = new URL('https://maps-docs-team.web.app/samples/layer-data-event/dist/');

async function init() {
    await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map')!;

    const innerMap = mapElement.innerMap;

    // Load GeoJSON.
    innerMap.data.loadGeoJson(new URL('./google.json', ASSET_BASE_URL).href);

    // Add some style.
    innerMap.data.setStyle((feature) => {
        return {
            fillColor: feature.getProperty('color') as string,
            strokeWeight: 1,
        };
    });

    // [START maps_layer_data_event_snippet]
    // Set mouseover event for each feature.
    innerMap.data.addListener(
        'mouseover',
        (event: google.maps.Data.MouseEvent) => {
            document.getElementById('info-box')!.textContent =
                event.feature.getProperty('letter') as string;
        }
    );
    // [END maps_layer_data_event_snippet]
}

void init();
// [END maps_layer_data_event]
