/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_rgm_autocomplete]
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
    APIProvider,
    Map,
    MapControl,
    ControlPosition,
    AdvancedMarker,
    InfoWindow,
    useMap,
    useMapsLibrary,
    useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';

const API_KEY = 'GOOGLE_MAPS_API_KEY';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'gmp-place-autocomplete': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            >;
        }
    }
}

const PlaceAutocomplete = ({
    onPlaceSelect,
}: {
    onPlaceSelect: (place: google.maps.places.Place | null) => void;
}) => {
    const map = useMap();
    const placesLibrary = useMapsLibrary('places');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!map || !placesLibrary || !containerRef.current) return;

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
        const placeSelectListener = (e: Event) => {
            const event = e as google.maps.places.PlacePredictionSelectEvent;
            const placePrediction = event.placePrediction;
            if (!placePrediction) {
                onPlaceSelect(null);
                return;
            }

            const place = placePrediction.toPlace();

            place
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
                    } else if (place.location) {
                        map.setCenter(place.location);
                        map.setZoom(13);
                    }
                    onPlaceSelect(place);
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

    return (
        <div
            className="place-autocomplete-card"
            style={{
                backgroundColor: '#fff',
                borderRadius: '5px',
                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                margin: '10px',
                padding: '5px',
                fontFamily: 'Roboto, sans-serif',
                fontSize: 'small',
                width: '300px',
            }}>
            <div ref={containerRef} style={{ width: '100%' }} />
        </div>
    );
};

export default function App() {
    const [selectedPlace, setSelectedPlace] =
        useState<google.maps.places.Place | null>(null);
    const [markerRef, marker] = useAdvancedMarkerRef();

    return (
        <APIProvider apiKey={API_KEY}>
            <Map
                defaultCenter={{ lat: 40.749933, lng: -73.98633 }}
                defaultZoom={13}
                gestureHandling={'greedy'}
                mapId="DEMO_MAP_ID"
                disableDefaultUI={true}>
                <MapControl position={ControlPosition.BLOCK_START_INLINE_START}>
                    <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
                </MapControl>

                {selectedPlace?.location && (
                    <AdvancedMarker
                        ref={markerRef}
                        position={selectedPlace.location}
                    />
                )}

                {selectedPlace?.location && marker && (
                    <InfoWindow anchor={marker}>
                        <div>
                            <span style={{ fontWeight: 'bold' }}>
                                {selectedPlace.displayName ?? 'No name'}
                            </span>
                            <br />
                            <span>
                                {selectedPlace.formattedAddress ?? 'No address'}
                            </span>
                        </div>
                    </InfoWindow>
                )}
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
// [END maps_rgm_autocomplete]
