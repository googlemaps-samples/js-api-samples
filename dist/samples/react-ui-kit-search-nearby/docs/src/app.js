import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
{ /* [START maps_react_places_ui_kit_search_nearby] */ }
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import './styles.css';
const API_KEY = "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8";
const App = () => (_jsx(APIProvider, { apiKey: API_KEY, libraries: ['maps', 'places', 'marker', 'geometry', 'core'], children: _jsx(PlacesSearchLayout, {}) }));
const PlacesSearchLayout = () => {
    const [selectedType, setSelectedType] = useState('');
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const placeSearchRef = useRef(null);
    return (_jsxs("div", { className: "places-ui-kit", children: [_jsx("div", { className: "place-list-wrapper", ref: placeSearchRef }), _jsx("div", { className: "map-container", children: _jsxs(Map, { defaultCenter: { lat: 48.8566, lng: 2.3522 }, defaultZoom: 16, mapId: "DEMO_MAP_ID", clickableIcons: false, onClick: () => setSelectedPlace(null), children: [_jsx(PlaceSearchController, { placeSearchRef: placeSearchRef, selectedType: selectedType, setPlaces: setPlaces, setSelectedPlace: setSelectedPlace, selectedPlace: selectedPlace }), places.map(place => (place.location && (_jsx(AdvancedMarker, { position: place.location, onClick: () => {
                                console.log('Marker clicked:', place);
                                setSelectedPlace(place);
                            } }, place.id))))] }) }), _jsx("div", { className: "controls", children: _jsxs("select", { name: "types", className: "type-select", value: selectedType, onChange: (e) => setSelectedType(e.target.value), children: [_jsx("option", { value: "", children: "Select a place type" }), _jsx("option", { value: "cafe", children: "Cafe" }), _jsx("option", { value: "restaurant", children: "Restaurant" }), _jsx("option", { value: "electric_vehicle_charging_station", children: "EV charging station" })] }) })] }));
};
const PlaceSearchController = ({ placeSearchRef, selectedType, setPlaces, setSelectedPlace, selectedPlace }) => {
    const map = useMap();
    const coreLib = useMapsLibrary('core');
    const markerLib = useMapsLibrary('marker');
    const geometryLib = useMapsLibrary('geometry');
    const placeRequestRef = useRef(null);
    const popupMarkerRef = useRef(null);
    const placeDetailsRef = useRef(null);
    // Initialize the popup marker and place details element once
    useEffect(() => {
        if (!markerLib || !map)
            return;
        const placeDetails = document.createElement('gmp-place-details-compact');
        placeDetails.setAttribute('orientation', 'horizontal');
        placeDetailsRef.current = placeDetails;
        const placeRequest = document.createElement('gmp-place-details-place-request');
        placeRequestRef.current = placeRequest;
        const allContent = document.createElement('gmp-place-all-content');
        placeDetails.appendChild(placeRequest);
        placeDetails.appendChild(allContent);
        popupMarkerRef.current = new markerLib.AdvancedMarkerElement({
            map: null,
            content: placeDetails,
            zIndex: 100
        });
    }, [markerLib, map]);
    // Handle place search logic
    useEffect(() => {
        if (!map || !coreLib || !geometryLib || !placeSearchRef.current)
            return;
        if (!selectedType) {
            setPlaces([]);
            placeSearchRef.current.innerHTML = '';
            return;
        }
        const placeSearch = document.createElement('gmp-place-search');
        placeSearch.setAttribute('selectable', '');
        const allContent = document.createElement('gmp-place-all-content');
        const nearbyRequest = document.createElement('gmp-place-nearby-search-request');
        placeSearch.appendChild(allContent);
        placeSearch.appendChild(nearbyRequest);
        placeSearchRef.current.innerHTML = '';
        placeSearchRef.current.appendChild(placeSearch);
        const bounds = map.getBounds();
        const center = map.getCenter();
        if (!bounds || !center)
            return;
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const diameter = geometryLib.spherical.computeDistanceBetween(ne, sw);
        const radius = Math.min((diameter / 2), 50000);
        nearbyRequest.maxResultCount = 10;
        nearbyRequest.locationRestriction = { center, radius };
        nearbyRequest.includedTypes = [selectedType];
        const handleLoad = () => {
            const newPlaces = placeSearch.places || [];
            setPlaces(newPlaces);
            if (newPlaces.length > 0) {
                const newBounds = new coreLib.LatLngBounds();
                newPlaces.forEach((p) => p.location && newBounds.extend(p.location));
                if (!newBounds.isEmpty())
                    map.fitBounds(newBounds);
            }
        };
        const handleSelect = (event) => setSelectedPlace(event.place);
        placeSearch.addEventListener('gmp-load', handleLoad);
        placeSearch.addEventListener('gmp-select', handleSelect);
        return () => {
            placeSearch.removeEventListener('gmp-load', handleLoad);
            placeSearch.removeEventListener('gmp-select', handleSelect);
        };
    }, [map, coreLib, geometryLib, selectedType, placeSearchRef, setPlaces, setSelectedPlace]);
    // Handle popup display logic, mirroring the vanilla JS example
    useEffect(() => {
        if (!map || !popupMarkerRef.current || !placeRequestRef.current || !placeDetailsRef.current)
            return;
        if (selectedPlace && selectedPlace.location) {
            placeRequestRef.current.place = selectedPlace;
            if (placeDetailsRef.current)
                placeDetailsRef.current.style.display = 'block';
            popupMarkerRef.current.position = selectedPlace.location;
            popupMarkerRef.current.map = map;
            if (selectedPlace.viewport) {
                map.fitBounds(selectedPlace.viewport, { top: 0, left: 400 });
                placeDetailsRef.current.addEventListener('gmp-load', () => {
                    if (selectedPlace.viewport) {
                        map.fitBounds(selectedPlace.viewport, { top: 0, right: 450 });
                    }
                }, { once: true });
            }
        }
        else {
            popupMarkerRef.current.map = null;
            if (placeDetailsRef.current)
                placeDetailsRef.current.style.display = 'none';
        }
    }, [selectedPlace, map]);
    return null;
};
const root = createRoot(document.getElementById('app'));
root.render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
{ /* [END maps_react_places_ui_kit_search_nearby] */ }
