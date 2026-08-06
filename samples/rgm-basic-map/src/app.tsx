/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_rgm_basic_map]
import React from 'react';
import { createRoot } from 'react-dom/client';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

const API_KEY = 'GOOGLE_MAPS_API_KEY';

export default function App() {
    return (
        <APIProvider apiKey={API_KEY}>
            <Map
                defaultCenter={{ lat: 37.4220656, lng: -122.0840897 }}
                defaultZoom={10}
                mapId="DEMO_MAP_ID"
            >
                <AdvancedMarker
                    position={{ lat: 37.4220656, lng: -122.0840897 }}
                    title="Mountain View, CA"
                />
            </Map>
        </APIProvider>
    );
}

export function renderToDom(container: HTMLElement) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
// [END maps_rgm_basic_map]
