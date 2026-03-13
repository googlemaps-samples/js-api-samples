/*
- TODO: Refactor to use gmp-map and dynamic library loading.
- NOTE: Do NOT move data locally for this one; it's meant to be dynamic as USGS updates the data monthly.
        Generally I'd say only shift the data source if it's hosted on a CDN.
- TODO: Not sure if progress bar is something we want to document. Maybe if there were way more data?
*/

/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_deckgl_points]
import type * as GeoJSON from 'geojson';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { GeoJsonLayer } from '@deck.gl/layers';

type Properties = { mag: number };
type Feature = GeoJSON.Feature<GeoJSON.Point, Properties>;

const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;
let innerMap: google.maps.Map;

// Initialize and add the map
async function initMap() {
    //  Request the needed libraries.
    await google.maps.importLibrary('maps');

    innerMap = await mapElement.innerMap;

    const deckOverlay = new GoogleMapsOverlay({
        layers: [
            new GeoJsonLayer({
                id: 'earthquakes',
                data: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',
                filled: true,
                pointRadiusMinPixels: 2,
                pointRadiusMaxPixels: 200,
                opacity: 0.4,
                pointRadiusScale: 0.3,
                getPointRadius: (f: Feature) => Math.pow(10, f.properties.mag),
                getFillColor: [255, 70, 30, 180],
                autoHighlight: true,
                transitions: {
                    getPointRadius: {
                        type: 'spring',
                        stiffness: 0.1,
                        damping: 0.15,
                        enter: () => [0], // grow from size 0,
                        duration: 10000,
                    },
                },
                onDataLoad: () => {
                    console.log('Data is loaded.');
                },
            }),
        ],
    });

    deckOverlay.setMap(innerMap);
}

initMap();
// [END maps_deckgl_points]
