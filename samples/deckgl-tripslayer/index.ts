/**
 * @license
 * Copyright 2026 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_deckgl_tripslayer]
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { TripsLayer } from '@deck.gl/geo-layers';
import { Color } from '@deck.gl/core';

interface Data {
    vendor: number;
    path: [number, number][];
    timestamps: number[];
}

// Set the path to the GeoJSON data file.
const DATA_URL = new URL('./public/trips-v7.json', import.meta.url).toString();

const LOOP_LENGTH = 1800;
const VENDOR_COLORS: Color[] = [
    [255, 0, 0], // vendor #0
    [0, 0, 255], // vendor #1
];

async function init() {
    // Request needed libraries.
    await google.maps.importLibrary('maps');

    // Get the gmp-map element.
    const mapElement = document.querySelector('gmp-map')!;

    // Get the inner map.
    const innerMap = mapElement.innerMap;

    innerMap.setTilt(45);

    let currentTime = 0;
    const props = {
        id: 'trips',
        data: DATA_URL,
        getPath: (d: Data) => d.path,
        getTimestamps: (d: Data) => d.timestamps,
        getColor: (d: Data) => VENDOR_COLORS[d.vendor],
        opacity: 1,
        widthMinPixels: 2,
        trailLength: 180,
        currentTime,
        shadowEnabled: false,
    };

    const overlay = new GoogleMapsOverlay({});

    const animate = () => {
        currentTime = (currentTime + 1) % LOOP_LENGTH;

        const tripsLayer = new TripsLayer({
            ...props,
            currentTime,
        });

        overlay.setProps({
            layers: [tripsLayer],
        });

        window.requestAnimationFrame(animate);
    };

    window.requestAnimationFrame(animate);

    overlay.setMap(innerMap);
}

void init();
// [END maps_deckgl_tripslayer]
