/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_rgm_college_picker]
import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AdvancedMarker, Map, Pin, APIProvider, } from '@vis.gl/react-google-maps';
import { PlaceReviews, PlaceDataProvider, PlaceDirectionsButton, IconButton, PlaceOverview, SplitLayout, OverlayLayout, PlacePicker, } from '@googlemaps/extended-component-library/react';
const API_KEY = 'GOOGLE_MAPS_API_KEY';
const DEFAULT_CENTER = { lat: 38, lng: -98 };
const DEFAULT_ZOOM = 4;
const DEFAULT_ZOOM_WITH_LOCATION = 16;
/**
 * Sample app that helps users locate a college on the map, with place info such
 * as ratings, photos, and reviews displayed on the side.
 */
export default function App() {
    const overlayLayoutRef = useRef(null);
    const pickerRef = useRef(null);
    const [college, setCollege] = useState(undefined);
    /**
     * We track the map's camera state separately and use an onCameraChanged listener.
     * This prevents the map from becoming strictly "controlled" by college.location,
     * which would otherwise lock the camera and prevent the user from panning or zooming.
     */
    const [cameraProps, setCameraProps] = useState({
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
    });
    useEffect(() => {
        if (college?.location) {
            setCameraProps({
                center: {
                    lat: college.location.lat(),
                    lng: college.location.lng(),
                },
                zoom: DEFAULT_ZOOM_WITH_LOCATION,
            });
        }
    }, [college]);
    /**
     * See https://lit.dev/docs/frameworks/react/#using-slots for why
     * we need to wrap our custom elements in a div with a slot attribute.
     */
    return (React.createElement("div", { className: "App" },
        React.createElement(APIProvider, { solutionChannel: "GMP_devsite_samples_v3_rgmcollegepicker", apiKey: API_KEY, version: "beta" },
            React.createElement(SplitLayout, { rowReverse: true, rowLayoutMinWidth: 700 },
                React.createElement("div", { className: "SlotDiv", slot: "fixed" },
                    React.createElement(OverlayLayout, { ref: overlayLayoutRef },
                        React.createElement("div", { className: "SlotDiv", slot: "main" },
                            React.createElement(PlacePicker, { className: "CollegePicker", ref: pickerRef, forMap: "gmap", country: ['us', 'ca'], type: "university", placeholder: "Enter a college in the US or Canada", onPlaceChange: () => {
                                    if (!pickerRef.current?.value) {
                                        setCollege(undefined);
                                    }
                                    else {
                                        setCollege(pickerRef.current.value);
                                    }
                                } }),
                            React.createElement(PlaceOverview, { size: "large", place: college, googleLogoAlreadyDisplayed: true },
                                React.createElement("div", { slot: "action", className: "SlotDiv" },
                                    React.createElement(IconButton, { slot: "action", variant: "filled", onClick: () => {
                                            if (overlayLayoutRef.current)
                                                void overlayLayoutRef.current.showOverlay();
                                        } }, "See Reviews")),
                                React.createElement("div", { slot: "action", className: "SlotDiv" },
                                    React.createElement(PlaceDirectionsButton, { slot: "action", variant: "filled" }, "Directions")))),
                        React.createElement("div", { slot: "overlay", className: "SlotDiv" },
                            React.createElement(IconButton, { className: "CloseButton", onClick: () => {
                                    if (overlayLayoutRef.current)
                                        void overlayLayoutRef.current.hideOverlay();
                                } }, "Close"),
                            React.createElement(PlaceDataProvider, { place: college },
                                React.createElement(PlaceReviews, null))))),
                React.createElement("div", { className: "SplitLayoutContainer", slot: "main" },
                    React.createElement(Map, { id: "gmap", mapId: "8c732c82e4ec29d9", ...cameraProps, onCameraChanged: (ev) => {
                            setCameraProps(ev.detail);
                        } }, college?.location && (React.createElement(AdvancedMarker, { position: college.location },
                        React.createElement(Pin, { background: '#FBBC04', glyphColor: '#000', borderColor: '#000' })))))))));
}
export function renderToDom(container) {
    const root = createRoot(container);
    root.render(React.createElement(React.StrictMode, null,
        React.createElement(App, null)));
}
// [END maps_rgm_college_picker]
