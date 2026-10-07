/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_marker_clustering]
import { MarkerClusterer } from '@googlemaps/markerclusterer';

async function init() {
    // Request needed libraries.
    const [{ InfoWindow }, { AdvancedMarkerElement, PinElement }] =
        await Promise.all([
            google.maps.importLibrary('maps'),
            google.maps.importLibrary('marker'),
        ]);

    const mapElement =
        document.querySelector<google.maps.MapElement>('gmp-map')!;
    const innerMap = mapElement.innerMap;

    const infoWindow = new InfoWindow({
        content: '',
        disableAutoPan: true,
    });

    // Create an array of alphabetical characters used to label the markers.
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Add some markers to the map.
    const markers = locations.map((position, i) => {
        const label = labels[i % labels.length];
        const pinGlyph = new PinElement({
            glyphText: label,
            glyphColor: 'white',
        });

        const marker = new AdvancedMarkerElement({
            position,
            content: pinGlyph,
            gmpClickable: true,
        });

        // markers can only be keyboard focusable when they have click listeners
        // open info window when marker is clicked
        marker.addEventListener('gmp-click', () => {
            const content = document.createElement('div');
            content.textContent = `${String(position.lat)}, ${String(position.lng)}`;
            infoWindow.setContent(content);

            infoWindow.open({
                anchor: marker,
                map: innerMap,
            });
        });
        return marker;
    });

    // Add a marker clusterer to manage the markers.
    new MarkerClusterer({ markers, map: innerMap });
}

const locations = [
    { lat: -31.56391, lng: 147.154312 },
    { lat: -33.718234, lng: 150.363181 },
    { lat: -33.727111, lng: 150.371124 },
    { lat: -33.848588, lng: 151.209834 },
    { lat: -33.851702, lng: 151.216968 },
    { lat: -34.671264, lng: 150.863657 },
    { lat: -35.304724, lng: 148.662905 },
    { lat: -36.817685, lng: 175.699196 },
    { lat: -36.828611, lng: 175.790222 },
    { lat: -37.75, lng: 145.116667 },
    { lat: -37.759859, lng: 145.128708 },
    { lat: -37.765015, lng: 145.133858 },
    { lat: -37.770104, lng: 145.143299 },
    { lat: -37.7737, lng: 145.145187 },
    { lat: -37.774785, lng: 145.137978 },
    { lat: -37.819616, lng: 144.968119 },
    { lat: -38.330766, lng: 144.695692 },
    { lat: -39.927193, lng: 175.053218 },
    { lat: -41.330162, lng: 174.865694 },
    { lat: -42.734358, lng: 147.439506 },
    { lat: -42.734358, lng: 147.501315 },
    { lat: -42.735258, lng: 147.438 },
    { lat: -43.999792, lng: 170.463352 },
];

void init();
// [END maps_marker_clustering]
