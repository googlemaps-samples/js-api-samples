import { jsx as _jsx } from "react/jsx-runtime";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
{ /* [START maps_react_ui_kit_place_details_latlng_compact] */ }
import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import './styles.css';
const API_KEY = "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8";
// Renders place details using a latitude and longitude.
const PlaceDetails = ({ lat, lng }) => {
    const places = useMapsLibrary('places');
    const containerRef = useRef(null);
    useEffect(() => {
        if (!places || !containerRef.current) {
            return;
        }
        // Create the gmp-place-details-compact element.
        const placeDetails = document.createElement('gmp-place-details-compact');
        // Set the orientation.
        placeDetails.setAttribute('orientation', 'horizontal');
        // Create the gmp-place-details-location-request element.
        const locationRequest = document.createElement('gmp-place-details-location-request');
        // Set the location on the location request element.
        locationRequest.setAttribute('location', `${lat},${lng}`);
        // Append the location request to the place details element.
        placeDetails.appendChild(locationRequest);
        // Create and append the content config and its children.
        const contentConfig = document.createElement('gmp-place-content-config');
        contentConfig.innerHTML = `
      <gmp-place-media lightbox-preferred></gmp-place-media>
      <gmp-place-rating></gmp-place-rating>
      <gmp-place-type></gmp-place-type>
      <gmp-place-price></gmp-place-price>
      <gmp-place-accessible-entrance-icon></gmp-place-accessible-entrance-icon>
      <gmp-place-open-now-status></gmp-place-open-now-status>
      <gmp-place-attribution></gmp-place-attribution>
    `;
        placeDetails.appendChild(contentConfig);
        // Append the place details element to the container.
        containerRef.current.innerHTML = ''; // Clear previous content
        containerRef.current.appendChild(placeDetails);
    }, [places, lat, lng]);
    return _jsx("div", { ref: containerRef, className: "place-details-container" });
};
const App = () => {
    return (_jsx(APIProvider, { apiKey: API_KEY, libraries: ['places'], children: _jsx("div", { className: "places-ui-kit", children: _jsx(PlaceDetails, { lat: 48.8566, lng: 2.3522 }) }) }));
};
export default App;
export function renderToDom(container) {
    const root = createRoot(container);
    root.render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
}
{ /* [END maps_react_ui_kit_place_details_latlng_compact] */ }
