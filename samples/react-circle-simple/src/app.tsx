/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_react_circle_simple_app]
import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { APIProvider, Map, AdvancedMarker, useMap, MapMouseEvent } from '@vis.gl/react-google-maps';

const API_KEY = 'GOOGLE_MAPS_API_KEY';

// -----------------------------------------------------------------------------
// The @vis.gl/react-google-maps library does not provide a native <Circle> component.
// Users are expected to build their own wrapper component using the useMap() hook 
// and the imperative google.maps.Circle class. 
// -----------------------------------------------------------------------------
type CircleProps = google.maps.CircleOptions & {
    onCenterChanged?: (center: google.maps.LatLngLiteral) => void;
};

const Circle = ({ onCenterChanged, ...options }: CircleProps) => {
    const map = useMap();
    const circleRef = useRef<google.maps.Circle | null>(null);

    useEffect(() => {
        if (!map) return;
        
        // Instantiate the circle only once when the map is ready
        circleRef.current = new google.maps.Circle({
            map,
            ...options
        });

        return () => {
            if (circleRef.current) {
                circleRef.current.setMap(null);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]); 

    // Update the circle imperatively when React props (options) change.
    // We explicitly extract radius and center to avoid passing a new options object
    // reference on every render, which causes infinite loops!
    const { radius, center } = options;
    useEffect(() => {
        if (circleRef.current) {
            circleRef.current.setOptions({ radius, center });
        }
    }, [radius, center]);

    // Handle events
    useEffect(() => {
        if (!circleRef.current || !onCenterChanged) return;
        
        const listener = circleRef.current.addListener('center_changed', () => {
            const newCenter = circleRef.current?.getCenter();
            if (newCenter) {
                const lat = newCenter.lat();
                const lng = newCenter.lng();
                
                // CRITICAL FIX: The Maps API has floating point precision loss when it 
                // projects coordinates. Calling setOptions({center}) slightly changes the float,
                // which fires center_changed again, resulting in an infinite loop!
                // We only update React state if the drag distance was meaningful.
                if (
                    !center || 
                    Math.abs(lat - (center.lat as number)) > 0.000001 || 
                    Math.abs(lng - (center.lng as number)) > 0.000001
                ) {
                    onCenterChanged({ lat, lng });
                }
            }
        });

        return () => {
            google.maps.event.removeListener(listener);
        };
    }, [onCenterChanged, center]);

    return null; // A circle has no DOM representation, so we return null
};

// -----------------------------------------------------------------------------
// Component to handle map clicks and imperatively pan the map
// -----------------------------------------------------------------------------
const MapClickHandler = ({ onMapClick }: { onMapClick: (latLng: google.maps.LatLngLiteral) => void }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;
        const listener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                const center = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                onMapClick(center);
                map.panTo(center); // Imperatively pan the map
            }
        });

        return () => google.maps.event.removeListener(listener);
    }, [map, onMapClick]);

    return null;
};

// -----------------------------------------------------------------------------
// Main Application
// -----------------------------------------------------------------------------
export default function App() {
    const initialCenter = { lat: 34.98956821576194, lng: 135.74239981260283 };
    const [circleCenter, setCircleCenter] = useState(initialCenter);
    const [radius, setRadius] = useState(400);

    return (
        <APIProvider apiKey={API_KEY}>
            <div className="control-panel">
                <strong>Radius</strong>
                <label>
                    <input type="radio" name="radius" value="400" checked={radius === 400} onChange={() => setRadius(400)} />
                    Short Walk (~5 minutes)
                </label>
                <label>
                    <input type="radio" name="radius" value="800" checked={radius === 800} onChange={() => setRadius(800)} />
                    Medium Walk (~15 minutes)
                </label>
                <label>
                    <input type="radio" name="radius" value="1600" checked={radius === 1600} onChange={() => setRadius(1600)} />
                    Long Walk (~30 minutes)
                </label>
            </div>

            <Map
                defaultCenter={initialCenter}
                defaultZoom={16}
                mapId="DEMO_MAP_ID"
                disableDefaultUI={true}
            >
                {/* Handles clicks and pans the map imperatively */}
                <MapClickHandler onMapClick={setCircleCenter} />
                
                <Circle 
                    center={circleCenter}
                    radius={radius}
                    strokeColor="#ffdd00ff"
                    strokeOpacity={0.8}
                    strokeWeight={2}
                    fillColor="#ffdd00ff"
                    fillOpacity={0.35}
                    draggable={true}
                    editable={false}
                    onCenterChanged={setCircleCenter}
                />
                
                <AdvancedMarker 
                    position={circleCenter} 
                    title="Center"
                >
                    <div style={{ transform: 'translate(0, 50%)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-6 -6 12 12">
                            <path d="M -6,0 L 6,0 M 0,-6 L 0,6" stroke="black" strokeWidth="1"/>
                        </svg>
                    </div>
                </AdvancedMarker>
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
// [END maps_react_circle_simple_app]
