/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
{/* [START maps_react_ui_kit_place_details] */}
import React from 'react';
import {createRoot} from 'react-dom/client';
import {APIProvider, useMapsLibrary} from '@vis.gl/react-google-maps';

import './styles.css';

const API_KEY = "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8";

type PlaceDetailsProps = {
  placeId: string;
};

// Renders place details using a place ID.
const PlaceDetails = ({placeId}: PlaceDetailsProps) => {
  const places = useMapsLibrary('places');
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!places || !containerRef.current) {
      return;
    }
    // Create the gmp-place-details element.
    const placeDetails = document.createElement('gmp-place-details');

    // Create the gmp-place-details-place-request element.
    const placeRequest = document.createElement(
      'gmp-place-details-place-request',
    );

    // Set the place on the place request element.
    placeRequest.setAttribute('place', placeId);

    // Append the place request to the place details element.
    placeDetails.appendChild(placeRequest);

    // Create and append the content config and its children.
    const contentConfig = document.createElement('gmp-place-content-config');
    contentConfig.innerHTML = `
      <gmp-place-address></gmp-place-address>
      <gmp-place-rating></gmp-place-rating>
      <gmp-place-type></gmp-place-type>
      <gmp-place-price></gmp-place-price>
      <gmp-place-accessible-entrance-icon></gmp-place-accessible-entrance-icon>
      <gmp-place-opening-hours></gmp-place-opening-hours>
      <gmp-place-website></gmp-place-website>
      <gmp-place-phone-number></gmp-place-phone-number>
      <gmp-place-summary></gmp-place-summary>
      <gmp-place-type-specific-highlights></gmp-place-type-specific-highlights>
      <gmp-place-reviews></gmp-place-reviews>
      <gmp-place-feature-list></gmp-place-feature-list>
      <gmp-place-media lightbox-preferred></gmp-place-media>
      <gmp-place-attribution
        light-scheme-color="gray"
        dark-scheme-color="white"></gmp-place-attribution>
    `;
    placeDetails.appendChild(contentConfig);

    // Append the place details element to the container.
    containerRef.current.innerHTML = ''; // Clear previous content
    containerRef.current.appendChild(placeDetails);
  }, [places, placeId]);

  return <div ref={containerRef} className="place-details-container" />;
};

const App = () => {
  return (
    <APIProvider apiKey={API_KEY} libraries={['places']}>
      <div className="places-ui-kit">
        <PlaceDetails placeId="ChIJ5bx0qiVu5kcRs_dMpI5ttiY" />
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

{/* [END maps_react_ui_kit_place_details] */}