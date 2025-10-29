import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Map3D } from './map-3d';
import './styles.css';
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const INITIAL_VIEW_PROPS = {
    center: { lat: 37.69637422900176, lng: -118.5041096347873, altitude: 4020000 },
    range: 50000,
    heading: 0,
    tilt: 25,
    roll: 0
};
const Map3DExample = () => {
    const [viewProps, setViewProps] = useState(INITIAL_VIEW_PROPS);
    const handleCameraChange = useCallback((props) => {
        setViewProps(oldProps => ({ ...oldProps, ...props }));
    }, []);
    const handleMapClick = useCallback((ev) => {
        if (!ev.detail.latLng)
            return;
        const { lat, lng } = ev.detail.latLng;
        setViewProps(p => ({ ...p, center: { lat, lng, altitude: 0 } }));
    }, []);
    return (_jsx(_Fragment, { children: _jsx(Map3D, { ...viewProps, onCameraChange: handleCameraChange, defaultLabelsDisabled: true }) }));
};
const App = () => {
    const nonAlphaVersionLoaded = Boolean(globalThis &&
        globalThis.google?.maps?.version &&
        !globalThis.google?.maps?.version.endsWith('-alpha'));
    if (nonAlphaVersionLoaded) {
        location.reload();
        return;
    }
    return (_jsx(APIProvider, { apiKey: API_KEY, version: 'nightly', children: _jsx(Map3DExample, {}) }));
};
export default App;
export function renderToDom(container) {
    const root = createRoot(container);
    root.render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
}
