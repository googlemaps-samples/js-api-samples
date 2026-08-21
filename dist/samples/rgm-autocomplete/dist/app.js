/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_rgm_autocomplete]
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { APIProvider, Map, MapControl, ControlPosition, AdvancedMarker, InfoWindow, useMap, useMapsLibrary, useAdvancedMarkerRef, } from '@vis.gl/react-google-maps';
const API_KEY = 'GOOGLE_MAPS_API_KEY';
const PlaceAutocomplete = ({ onPlaceSelect, }) => {
    const map = useMap();
    const placesLibrary = useMapsLibrary('places');
    const containerRef = useRef(null);
    useEffect(() => {
        if (!map || !placesLibrary || !containerRef.current)
            return;
        // 1. Programmatically instantiate the modern PlaceAutocompleteElement
        const autocomplete = new placesLibrary.PlaceAutocompleteElement();
        containerRef.current.appendChild(autocomplete);
        // 2. Manually sync the map's bounds to the autocomplete's locationRestriction.
        // We use map.getBounds().toJSON() to pass a plain object literal, which safely
        // bypasses any cross-context 'instanceof' wipeout issues in React.
        const syncBounds = () => {
            const bounds = map.getBounds();
            if (bounds) {
                autocomplete.locationRestriction = bounds.toJSON();
            }
        };
        // Sync initially and whenever the map moves.
        syncBounds();
        const boundsListener = map.addListener('bounds_changed', syncBounds);
        // 3. Listen for the gmp-select event.
        const placeSelectListener = (e) => {
            const event = e;
            const place = event.placePrediction.toPlace();
            void place
                .fetchFields({
                fields: [
                    'location',
                    'viewport',
                    'displayName',
                    'formattedAddress',
                ],
            })
                .then(() => {
                if (place.viewport) {
                    map.fitBounds(place.viewport);
                }
                else if (place.location) {
                    map.setCenter(place.location);
                    map.setZoom(13);
                }
                onPlaceSelect(place);
            })
                .catch((err) => {
                console.error(err);
            });
        };
        autocomplete.addEventListener('gmp-select', placeSelectListener);
        return () => {
            google.maps.event.removeListener(boundsListener);
            autocomplete.removeEventListener('gmp-select', placeSelectListener);
            // Clean up the DOM element when unmounting.
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [map, placesLibrary, onPlaceSelect]);
    return (React.createElement("div", { className: "place-autocomplete-card", style: {
            backgroundColor: '#fff',
            borderRadius: '5px',
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
            margin: '10px',
            padding: '5px',
            fontFamily: 'Roboto, sans-serif',
            fontSize: 'small',
            width: '300px',
        } },
        React.createElement("div", { ref: containerRef, style: { width: '100%' } })));
};
export default function App() {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [markerRef, marker] = useAdvancedMarkerRef();
    return (React.createElement(APIProvider, { apiKey: API_KEY },
        React.createElement(Map, { defaultCenter: { lat: 40.749933, lng: -73.98633 }, defaultZoom: 13, gestureHandling: 'greedy', mapId: "DEMO_MAP_ID", disableDefaultUI: true },
            React.createElement(MapControl, { position: ControlPosition.BLOCK_START_INLINE_START },
                React.createElement(PlaceAutocomplete, { onPlaceSelect: setSelectedPlace })),
            selectedPlace?.location && (React.createElement(AdvancedMarker, { ref: markerRef, position: selectedPlace.location })),
            selectedPlace?.location && marker && (React.createElement(InfoWindow, { anchor: marker },
                React.createElement("div", null,
                    React.createElement("span", { style: { fontWeight: 'bold' } }, selectedPlace.displayName ?? 'No name'),
                    React.createElement("br", null),
                    React.createElement("span", null, selectedPlace.formattedAddress ?? 'No address')))))));
}
export function renderToDom(container) {
    const root = createRoot(container);
    root.render(React.createElement(React.StrictMode, null,
        React.createElement(App, null)));
}
// [END maps_rgm_autocomplete]
