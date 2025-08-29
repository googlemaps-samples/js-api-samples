/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_react_ui_kit_place_details_by_latlng_compact]
import React from 'react';
import {createRoot} from 'react-dom/client';
import {APIProvider, useMapsLibrary} from '@vis.gl/react-google-maps';

import './styles.css';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

if (!API_KEY) {
  console.error('Missing Google Maps API key');
}

type PlaceDetailsProps = {
  lat: number;
  lng: number;
};

// Renders place details using a latitude and longitude.
const PlaceDetails = ({lat, lng}: PlaceDetailsProps) => {
  const places = useMapsLibrary('places');

  // Wait for the places library to load.
  if (!places) {
    return null;
  }
  const placeDetailsHtml = `
    <gmp-place-details-compact orientation="horizontal">
      <gmp-place-details-location-request location="${lat},${lng}"></gmp-place-details-location-request>
      <gmp-place-content-config>
          <gmp-place-media lightbox-preferred></gmp-place-media>
          <gmp-place-rating></gmp-place-rating>
          <gmp-place-type></gmp-place-type>
          <gmp-place-price></gmp-place-price>
          <gmp-place-accessible-entrance-icon></gmp-place-accessible-entrance-icon>
          <gmp-place-open-now-status></gmp-place-open-now-status>
          <gmp-place-attribution></gmp-place-attribution>
      </gmp-place-content-config>
    </gmp-place-details-compact>
  `;

  return (
    <div
      className="place-details-container"
      dangerouslySetInnerHTML={{__html: placeDetailsHtml}}
    />
  );
};

const App = () => {
  return (
    <APIProvider apiKey={API_KEY} libraries={['places']}>
      <div className="places-ui-kit">
        <PlaceDetails lat={-37.80327936555322} lng={144.97176194782412} />
      </div>
    </APIProvider>
  );
};

export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
// [END maps_react_ui_kit_place_details_by_latlng_compact]

