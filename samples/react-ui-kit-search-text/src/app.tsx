/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
{
    /* [START maps_react_places_ui_kit_search_text] */
}
import React, { useState, useEffect, useRef, type RefObject } from 'react';
import { createRoot } from 'react-dom/client';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    useMap,
    useMapsLibrary,
} from '@vis.gl/react-google-maps';

import './styles.css';

const API_KEY = 'AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8';

if (!API_KEY) {
    console.error('Missing Google Maps API key');
}

const App = () => (
    <APIProvider
        apiKey={API_KEY}
        libraries={['maps', 'places', 'marker', 'geometry', 'core']}
        version="weekly"
    >
        <PlacesSearchLayout />
    </APIProvider>
);

const PlacesSearchLayout = () => {
    const [query, setQuery] = useState('');
    const [places, setPlaces] = useState<any[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

    const placeSearchRef = useRef<HTMLDivElement>(null);
    const queryInputRef = useRef<HTMLInputElement>(null);

    const handleSearch = () => {
        if (queryInputRef.current) {
            setQuery(queryInputRef.current.value);
        }
    };

    return (
        <>
            <div className="map-container">
                <Map
                    defaultCenter={{ lat: 48.8566, lng: 2.3522 }}
                    defaultZoom={14}
                    mapId="DEMO_MAP_ID"
                    clickableIcons={false}
                    onClick={() => setSelectedPlace(null)}
                >
                    <PlaceSearchController
                        placeSearchRef={placeSearchRef}
                        query={query}
                        setPlaces={setPlaces}
                        setSelectedPlace={setSelectedPlace}
                        selectedPlace={selectedPlace}
                    />
                    {places.map(
                        (place) =>
                            place.location && (
                                <AdvancedMarker
                                    key={place.id}
                                    position={place.location}
                                    onClick={() => {
                                        setSelectedPlace(place);
                                    }}
                                />
                            )
                    )}
                </Map>
            </div>
            <div className="place-list-wrapper" ref={placeSearchRef}></div>
            <div className="controls">
                <input
                    type="text"
                    ref={queryInputRef}
                    className="query-input"
                />
                <button className="search-button" onClick={handleSearch}>
                    Search
                </button>
            </div>
        </>
    );
};

interface PlaceSearchControllerProps {
    placeSearchRef: RefObject<HTMLDivElement | null>;
    query: string;
    setPlaces: (places: any[]) => void;
    setSelectedPlace: (place: any | null) => void;
    selectedPlace: any | null;
}

const PlaceSearchController = ({
    placeSearchRef,
    query,
    setPlaces,
    setSelectedPlace,
    selectedPlace,
}: PlaceSearchControllerProps) => {
    const map = useMap();
    const coreLib = useMapsLibrary('core');
    const markerLib = useMapsLibrary('marker');

    const placeRequestRef = useRef<any>(null);
    const popupMarkerRef =
        useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
    const placeDetailsRef = useRef<HTMLElement | null>(null);

    // Initialize the popup marker and place details element once
    useEffect(() => {
        if (!markerLib || !map) return;

        const placeDetails = document.createElement(
            'gmp-place-details-compact'
        );
        placeDetails.setAttribute('orientation', 'horizontal');
        placeDetailsRef.current = placeDetails;

        const placeRequest = document.createElement(
            'gmp-place-details-place-request'
        );
        placeRequestRef.current = placeRequest;

        const allContent = document.createElement('gmp-place-all-content');
        placeDetails.appendChild(placeRequest);
        placeDetails.appendChild(allContent);

        popupMarkerRef.current = new markerLib.AdvancedMarkerElement({
            map: null,
            content: placeDetails,
            zIndex: 100,
        });
    }, [markerLib, map]);

    // Handle place search logic by recreating the component on query change
    useEffect(() => {
        if (!map || !coreLib || !placeSearchRef.current) return;

        if (!query) {
            placeSearchRef.current.innerHTML = '';
            setPlaces([]);
            return;
        }

        const bounds = map.getBounds();
        if (!bounds) return;

        const placeSearch = document.createElement('gmp-place-search');
        placeSearch.setAttribute('selectable', '');
        placeSearch.setAttribute('orientation', 'vertical');
        placeSearch.setAttribute('attribution-position', 'top');
        placeSearch.style.display = 'block';

        const textRequest = document.createElement(
            'gmp-place-text-search-request'
        );
        (textRequest as any).textQuery = query;
        (textRequest as any).locationBias = bounds;
        placeSearch.appendChild(textRequest);

        const allContent = document.createElement('gmp-place-all-content');
        placeSearch.appendChild(allContent);

        placeSearchRef.current.innerHTML = '';
        placeSearchRef.current.appendChild(placeSearch);

        const handleLoad = () => {
            const newPlaces = (placeSearch as any).places || [];
            setPlaces(newPlaces);
            if (newPlaces.length > 0) {
                const newBounds = new coreLib.LatLngBounds();
                newPlaces.forEach(
                    (p: any) => p.location && newBounds.extend(p.location)
                );
                if (!newBounds.isEmpty()) map.fitBounds(newBounds);
            }
        };
        const handleSelect = (event: any) => setSelectedPlace(event.place);

        placeSearch.addEventListener('gmp-load', handleLoad);
        placeSearch.addEventListener('gmp-select', handleSelect);

        return () => {
            placeSearch.removeEventListener('gmp-load', handleLoad);
            placeSearch.removeEventListener('gmp-select', handleSelect);
        };
    }, [map, coreLib, query, placeSearchRef, setPlaces, setSelectedPlace]);

    // Handle popup display logic
    useEffect(() => {
        if (
            !map ||
            !popupMarkerRef.current ||
            !placeRequestRef.current ||
            !placeDetailsRef.current
        )
            return;

        if (selectedPlace && selectedPlace.location) {
            (placeRequestRef.current as any).place = selectedPlace;
            if (placeDetailsRef.current)
                placeDetailsRef.current.style.display = 'block';

            popupMarkerRef.current.position = selectedPlace.location;
            popupMarkerRef.current.map = map;

            if (selectedPlace.viewport) {
                map.fitBounds(selectedPlace.viewport, { top: 0, left: 400 });

                placeDetailsRef.current.addEventListener(
                    'gmp-load',
                    () => {
                        if (selectedPlace.viewport) {
                            map.fitBounds(selectedPlace.viewport, {
                                top: 0,
                                right: 450,
                            });
                        }
                    },
                    { once: true }
                );
            }
        } else {
            popupMarkerRef.current.map = null;
            if (placeDetailsRef.current)
                placeDetailsRef.current.style.display = 'none';
        }
    }, [selectedPlace, map]);

    return null;
};

const root = createRoot(document.getElementById('app') as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
{
    /* [END maps_react_places_ui_kit_search_text] */
}
