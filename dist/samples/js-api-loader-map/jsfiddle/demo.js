/**
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */


// Import the needed libraries.
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const API_KEY = 'AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8';
async function initMap() {
    
    // Set loader options.
    setOptions({
        key: API_KEY,
        v: 'weekly',
    });
    
    // Load the Maps library.
    const { Map } = (await importLibrary('maps'));
    // Set map options.
    const mapOptions = {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 3,
    };
    // Declare the map.
    const map = new Map(document.getElementById('map'), mapOptions);
}
initMap();

