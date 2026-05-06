/**
 * @license
 * Copyright 2026 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_deckgl_arclayer]
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ArcLayer } from '@deck.gl/layers';
import type * as GeoJSON from 'geojson';

type Properties = { scalerank: number };
type Feature = GeoJSON.Feature<GeoJSON.Point, Properties>;

async function initMap() {
    // Request needed libraries.
    await google.maps.importLibrary('maps');

    // Get the gmp-map element.
    const mapElement = document.querySelector('gmp-map')!;

    // Get the inner map.
    const innerMap = mapElement.innerMap;

    innerMap.setTilt(30); // Set tilt after map initialization.

    // Set the path to the GeoJSON data file.
    const dataUrl = new URL(
        './public/ne_10m_airports.geojson',
        import.meta.url
    ).toString();

    const flightsLayer = new ArcLayer<Feature>({
        id: 'flights',
        data: dataUrl,
        dataTransform: (data: any) =>
            data.features.filter((f: any) => f.properties.scalerank < 4),
        getSourcePosition: () => [14.42076, 50.08804], // Prague
        getTargetPosition: (f: Feature) =>
            f.geometry.coordinates as [number, number],
        getSourceColor: [0, 128, 200],
        getTargetColor: [0, 0, 80],
        getWidth: 1,
    });

    const overlay = new GoogleMapsOverlay({
        interleaved: false,
        layers: [flightsLayer],
    });

    overlay.setMap(innerMap);
}

initMap();
// [END maps_deckgl_arclayer]
