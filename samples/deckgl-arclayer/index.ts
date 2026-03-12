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
type Data = GeoJSON.FeatureCollection<GeoJSON.Point, Properties>;

//let map;

async function initMap() {
    // Request needed libraries.
    (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

    // Get the gmp-map element.
    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;

    // Get the inner map.
    const innerMap = mapElement.innerMap;

    innerMap.setTilt(30); // Set tilt after map initialization.

    const flightsLayer = new ArcLayer<Feature>({
        id: 'flights',
        data: '/ne_10m_airports.geojson', // See public/ne_10m_airports.geojson
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
        layers: [flightsLayer],
    });

    overlay.setMap(innerMap);
}

initMap();
// [END maps_deckgl_arclayer]
