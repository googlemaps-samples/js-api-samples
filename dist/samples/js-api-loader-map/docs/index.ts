/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_js_api_loader_map]
// [START maps_js_api_loader_map_load]
// Import the needed libraries.
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
// [END maps_js_api_loader_map_load]

const API_KEY = 'AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8';

async function init(): Promise<void> {
    // [START maps_js_api_loader_map_options]
    // Set loader options.
    setOptions({
        key: API_KEY,
    });
    // [END maps_js_api_loader_map_options]

    // Load the Maps library.
    const { Map } = await importLibrary('maps');

    // Set map options.
    const mapOptions = {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 3,
    };

    // Declare the map.
    new Map(document.getElementById('map')!, mapOptions);
}

void init();
// [END maps_js_api_loader_map]
