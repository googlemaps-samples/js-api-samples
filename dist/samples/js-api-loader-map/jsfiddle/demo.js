/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
const API_KEY = "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8";
async function initMap() {
    setOptions({ key: API_KEY });
    const { Map } = await importLibrary("maps");
    const mapOptions = {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 3,
    };
    const map = new Map(document.getElementById("map"), mapOptions);
}
initMap();

