/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_js_api_loader_map]
import { Loader } from '@googlemaps/js-api-loader';

const API_KEY = 'AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8';

async function initMap(): Promise<void> {
    const loader = new Loader({ apiKey: API_KEY });
    const { Map } = (await loader.importLibrary(
        'maps'
    )) as google.maps.MapsLibrary;

    const mapOptions: google.maps.MapOptions = {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 3,
    };

    const map = new Map(
        document.getElementById('map') as HTMLElement,
        mapOptions
    );
}

initMap();
// [END maps_js_api_loader_map]
