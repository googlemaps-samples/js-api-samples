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
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}) => {
    const map = useMap();
    const placesLibrary = useMapsLibrary('places');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!map || !placesLibrary || !inputRef.current) return;

        const options = {
            fields: ['geometry', 'name', 'formatted_address'],
            strictBounds: true, // This enforces the same strict bounds constraint as locationRestriction
        };

        const autocomplete = new placesLibrary.Autocomplete(inputRef.current, options);
        
        // The traditional API has a built-in bindTo method that flawlessly syncs to the map's internal bounds state
        autocomplete.bindTo('bounds', map);

        const listener = autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            
            if (!place.geometry || !place.geometry.location) {
                onPlaceSelect(null);
                return;
            }

            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
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
        useState<google.maps.places.PlaceResult | null>(null);
    const [markerRef, marker] = useAdvancedMarkerRef();

    return (
        <APIProvider apiKey={API_KEY}>
            <Map
                defaultCenter={{ lat: 40.749933, lng: -73.98633 }}
                defaultZoom={13}
                mapId="DEMO_MAP_ID"
                disableDefaultUI={true}>
                <MapControl position={ControlPosition.BLOCK_START_INLINE_START}>
                    <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
                </MapControl>

                {selectedPlace?.geometry?.location && (
                    <AdvancedMarker
                        ref={markerRef}
                        position={selectedPlace.geometry.location}
                    />
                )}

                {selectedPlace?.geometry?.location && marker && (
                    <InfoWindow anchor={marker}>
                        <div>
                            <span style={{ fontWeight: 'bold' }}>
                                {selectedPlace.name ?? 'No name'}
                            </span>
                            <br />
                            <span>
                                {selectedPlace.formatted_address ?? 'No address'}
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
