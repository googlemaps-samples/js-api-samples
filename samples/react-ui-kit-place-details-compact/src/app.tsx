/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_react_ui_kit_place_details_compact]
import React, {useEffect, useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {APIProvider, useMapsLibrary} from '@vis.gl/react-google-maps';

import './styles.css';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

if (!API_KEY) {
  console.error('Missing Google Maps API key');
}

type PlaceDetailsProps = {
  placeId: string;
};

// Renders place details using a place ID.
const PlaceDetails = ({placeId}: PlaceDetailsProps) => {
  const places = useMapsLibrary('places');

  // Wait for the places library to load.
  if (!places) {
    return null;
  }

  const placeDetailsHtml = `
    <gmp-place-details-compact orientation="horizontal">
      <gmp-place-details-place-request place="${placeId}"></gmp-place-details-place-request>
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
        <PlaceDetails placeId="ChIJC8HakaIRkFQRiOgkgdHmqkk" />
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
// [END maps_react_ui_kit_place_details_compact]

