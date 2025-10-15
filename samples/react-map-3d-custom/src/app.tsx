import React, {useCallback, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, MapMouseEvent} from '@vis.gl/react-google-maps';

import {Map3D, Map3DCameraProps} from './map-3d';

import './style.css';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;

const INITIAL_VIEW_PROPS = {
  center: {lat: 37.69637422900176, lng:-118.5041096347873, altitude: 4020000},
  range: 50000,
  heading: 0,
  tilt: 25,
  roll: 0
};

const Map3DExample = () => {
  const [viewProps, setViewProps] = useState(INITIAL_VIEW_PROPS);

  const handleCameraChange = useCallback((props: Map3DCameraProps) => {
    setViewProps(oldProps => ({...oldProps, ...props}));
  }, []);

  const handleMapClick = useCallback((ev: MapMouseEvent) => {
    if (!ev.detail.latLng) return;

    const {lat, lng} = ev.detail.latLng;
    setViewProps(p => ({...p, center: {lat, lng, altitude: 0}}));
  }, []);

  return (
    <>
      <Map3D
        {...viewProps}
        onCameraChange={handleCameraChange}
        defaultLabelsDisabled
      />
    </>
  );
};

const App = () => {
  const nonAlphaVersionLoaded = Boolean(
    globalThis &&
      globalThis.google?.maps?.version &&
      !globalThis.google?.maps?.version.endsWith('-alpha')
  );

  if (nonAlphaVersionLoaded) {
    location.reload();
    return;
  }

  return (
    <APIProvider apiKey={API_KEY} version={'nightly'}>
      <Map3DExample />
    </APIProvider>
  );
};
export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
