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
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!map || !placesLibrary || !inputRef.current) return;

        const options = {
            // Only request the ID, as we will use it to construct the modern Place object
            fields: ['place_id'],
            strictBounds: true, 
        };

        const autocomplete = new placesLibrary.Autocomplete(inputRef.current, options);
        
        // The traditional API has a built-in bindTo method that flawlessly syncs to the map's internal bounds state
        autocomplete.bindTo('bounds', map);

        const listener = autocomplete.addListener('place_changed', async () => {
            const placeResult = autocomplete.getPlace();
            
            if (!placeResult.place_id) {
                onPlaceSelect(null);
                return;
            }

            // Construct the modern Place object using the ID
            const place = new placesLibrary.Place({
                id: placeResult.place_id,
            });

            // Fetch the modern fields
            await place.fetchFields({
                fields: ['location', 'viewport', 'displayName', 'formattedAddress'],
            });

            if (place.viewport) {
                map.fitBounds(place.viewport);
            } else if (place.location) {
                map.setCenter(place.location);
                map.setZoom(13);
            }

            onPlaceSelect(place);
        });

        return () => {
            google.maps.event.removeListener(listener);
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
            <input
                ref={inputRef}
                type="text"
                placeholder="Search for a place..."
                style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 12px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                    fontSize: '14px',
                    outline: 'none',
                }}
            />
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
