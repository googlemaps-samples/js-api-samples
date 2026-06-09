/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_map_projection_simple]
// This example defines an image map type using the Gall-Peters
// projection.
// https://en.wikipedia.org/wiki/Gall%E2%80%93Peters_projection
const mapElement = document.querySelector('gmp-map')!;
let innerMap: google.maps.Map;

async function init() {
    // Request the needed libraries.
    await google.maps.importLibrary('maps');

    // Create a map.
    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
    });

    // Set the Gall-Peters map type.
    void initGallPeters();
    innerMap.mapTypes.set('gallPeters', gallPetersMapType);
    innerMap.setMapTypeId('gallPeters');

    // Show the lat and lng under the mouse cursor.
    const coordsDiv = document.getElementById('coords')!;

    innerMap.addListener('mousemove', (event: google.maps.MapMouseEvent) => {
        coordsDiv.textContent = `lat: ${String(Math.round(event.latLng!.lat()))}, lng: ${String(Math.round(event.latLng!.lng()))}`;
    });

    // Add some markers to the map.
    innerMap.data.setStyle((feature) => {
        return {
            title: feature.getProperty('name') as string,
            optimized: false,
        };
    });
    innerMap.data.addGeoJson(cities);
}

let gallPetersMapType: google.maps.ImageMapType;

async function initGallPeters() {
    const [{ ImageMapType }, { Size, Point, LatLng }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('core'),
    ]);

    const GALL_PETERS_RANGE_X = 800;
    const GALL_PETERS_RANGE_Y = 512;

    // Fetch Gall-Peters tiles stored locally on our server.
    gallPetersMapType = new ImageMapType({
        getTileUrl(coord, zoom) {
            const scale = 1 << zoom;

            // Wrap tiles horizontally.
            const x = ((coord.x % scale) + scale) % scale;

            // Don't wrap tiles vertically.
            const y = coord.y;

            if (y < 0 || y >= scale) return '';

            return `gall-peters_${zoom}_${x}_${y}.png`;
        },
        tileSize: new Size(GALL_PETERS_RANGE_X, GALL_PETERS_RANGE_Y),
        minZoom: 0,
        maxZoom: 1,
        name: 'Gall-Peters',
    });

    // Describe the Gall-Peters projection used by these tiles.
    gallPetersMapType.projection = {
        fromLatLngToPoint(latLng: google.maps.LatLng) {
            const latRadians = (latLng.lat() * Math.PI) / 180;
            return new Point(
                GALL_PETERS_RANGE_X * (0.5 + latLng.lng() / 360),
                GALL_PETERS_RANGE_Y * (0.5 - 0.5 * Math.sin(latRadians))
            );
        },
        fromPointToLatLng(point: google.maps.Point, noWrap?: boolean) {
            const x = point.x / GALL_PETERS_RANGE_X;
            const y = Math.max(0, Math.min(1, point.y / GALL_PETERS_RANGE_Y));

            return new LatLng(
                (Math.asin(1 - 2 * y) * 180) / Math.PI,
                -180 + 360 * x,
                noWrap
            );
        },
    };
}

// GeoJSON, describing the locations and names of some cities.
const cities = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-87.65, 41.85] },
            properties: { name: 'Chicago' },
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-149.9, 61.218] },
            properties: { name: 'Anchorage' },
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-99.127, 19.427] },
            properties: { name: 'Mexico City' },
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-0.126, 51.5] },
            properties: { name: 'London' },
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [28.045, -26.201] },
            properties: { name: 'Johannesburg' },
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [15.322, -4.325] },
            properties: { name: 'Kinshasa' },
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [151.207, -33.867] },
            properties: { name: 'Sydney' },
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [0, 0] },
            properties: { name: '0°N 0°E' },
        },
    ],
};

void init();
// [END maps_map_projection_simple]
