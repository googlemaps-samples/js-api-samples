/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_deckgl_points]

import { Feature } from 'geojson';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { GeoJsonLayer } from '@deck.gl/layers';

type Properties = { mag: number };

const mapElement = document.querySelector('gmp-map')!;
let innerMap: google.maps.Map;

interface EarthquakeProperties {
    mag: number;
    place: string;
    time: number;
}

/**
 * Validates that a feature has the properties we need for rendering.
 */
function isEarthquake(
    f: Feature
): f is Feature & { properties: EarthquakeProperties } {
    return (
        f.properties !== null &&
        typeof f.properties === 'object' &&
        typeof (f.properties as any).mag === 'number'
    );
}

// Initialize and add the map
async function initMap() {
    //  Request the needed libraries.
    await google.maps.importLibrary('maps');

    innerMap = mapElement.innerMap;

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
                getPointRadius: (f: Feature): number => {
                    if (isEarthquake(f)) {
                        return Math.pow(10, f.properties.mag);
                    }
                    return 0; // Fallback for invalid data.
                },
                getFillColor: (
                    f: Feature
                ): [number, number, number, number] => {
                    return [255, 70, 30, 180]; // Default color for other earthquakes.
                },
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
